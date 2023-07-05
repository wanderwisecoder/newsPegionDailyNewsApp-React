import React, { Component } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';

export class News extends Component {
	static defaultProps = {
		country: 'in',
		pageSize: 5,
		category: 'general',
	};

	static propTypes = {
		country: PropTypes.string,
		pageSize: PropTypes.number,
		category: PropTypes.string,
	};

	// program to convert first letter of a string to uppercase
	capitalizeFirstLetter = (str) => {
		// converting first letter to uppercase
		const capitalized = str.charAt(0).toUpperCase() + str.slice(1);

		return capitalized;
	};

	constructor(props) {
		super(props);
		console.log('Constructor has been called from news Componant.');
		this.state = {
			articles: [],
			loading: false,
			page: 1,
			totalResults: 0,
		};
		document.title = `${this.capitalizeFirstLetter(this.props.category)} - NewsPegion`;
	}

	async updateNews() {
		this.props.setProgress(10);
		const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
		this.setState({ loading: true });
		let data = await fetch(url);
		this.props.setProgress(35);
		let parsedData = await data.json();
		this.props.setProgress(70);
		console.log(parsedData);
		this.setState({
			articles: parsedData.articles,
			totalResults: parsedData.totalResults,
			loading: false,
		});
		this.props.setProgress(100);
	}
	async componentDidMount() {
		console.log('Component Did Mount');
		this.updateNews();
	}

	handlePrevClick = async () => {
		console.log('Privious');
		this.setState({ page: this.state.page - 1 });
		this.updateNews();
	};

	handleNextClick = async () => {
		console.log('Next');
		this.setState({ page: this.state.page + 1 });
		this.updateNews();
	};

	fetchMoreData = async () => {
		this.setState({ page: this.state.page + 1 });
		const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`;
		this.setState({ loading: true });
		let data = await fetch(url);
		let parsedData = await data.json();
		console.log(parsedData);
		this.setState({
			articles: this.state.articles.concat(parsedData.articles),
			totalResults: parsedData.totalResults,
			loading: false,
		});
	};

	render() {
		console.log('render');
		return (
			<>
				<h1
					className='text-center'
					style={{ margin: '35px 0px' }}
				>
					NewsPegion Daily - Top {this.capitalizeFirstLetter(this.props.category)} Headlines
				</h1>
				{/* {this.state.loading && <Spinner />} */}
				<InfiniteScroll
					dataLength={this.state.articles.length}
					next={this.fetchMoreData}
					hasMore={this.state.articles.length !== this.state.totalResults}
					loader={<Spinner />}
				>
					<div className='container'>
						<div className='row'>
							{this.state.articles.map((element) => {
								return (
									<div
										className='col-md-4'
										key={element.url}
									>
										<NewsItem
											title={element.title ? element.title : ''}
											description={element.description ? element.description.slice(0, 100) : ''}
											imageUrl={!element.urlToImage ? 'https://www.northampton.ac.uk/wp-content/uploads/2018/11/default-svp_news.jpg' : element.urlToImage}
											newsUrl={element.url}
											author={element.author}
											date={element.publishedAt}
											source={element.source.name}
										/>
									</div>
								);
							})}
						</div>
					</div>
				</InfiniteScroll>
			</>
		);
	}
}

export default News;

// ac9c642fcf064e10bd492933357561ed
