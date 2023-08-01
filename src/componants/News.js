import React, { useEffect, useState } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';

const News = (props) => {
	const [articles, setArticles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [totalResults, setTotalResults] = useState(0);

	// program to convert first letter of a string to uppercase
	const capitalizeFirstLetter = (str) => {
		// converting first letter to uppercase
		return str.charAt(0).toUpperCase() + str.slice(1);
	};

	const updateNews = async () => {
		props.setProgress(10);
		const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
		setLoading(true);
		let data = await fetch(url);
		props.setProgress(35);
		let parsedData = await data.json();
		props.setProgress(70);
		setArticles(parsedData.articles);
		setTotalResults(parsedData.totalResults);
		setLoading(false);
		console.log(parsedData);

		props.setProgress(100);
	};

	useEffect(() => {
		document.title = `${capitalizeFirstLetter(props.category)} - NewsPegion`;
		updateNews(); // eslint-disable-next-line
	}, []);

	// const handlePrevClick = async () => {
	// 	console.log('Privious');
	// 	setPage(page - 1);
	// 	updateNews(); // eslint-disable-next-line
	// };

	// const handleNextClick = async () => {
	// 	console.log('Next');
	// 	setPage(page + 1);
	// 	updateNews(); // eslint-disable-next-line
	// };

	const fetchMoreData = async () => {
		const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page + 1}&pageSize=${props.pageSize}`;
		setPage(page + 1);
		let data = await fetch(url);
		let parsedData = await data.json();
		setArticles(articles.concat(parsedData.articles));
		setTotalResults(parsedData.totalResults);
		console.log(parsedData);
	};

	console.log('render');
	return (
		<>
			<h1
				className='text-center'
				style={{ margin: '90px 0px 40px 0px' }}
			>
				NewsPegion Daily - Top {capitalizeFirstLetter(props.category)} Headlines
			</h1>
			{loading && <Spinner />}
			<InfiniteScroll
				dataLength={articles.length}
				next={fetchMoreData}
				hasMore={articles.length !== totalResults}
				loader={<Spinner />}
			>
				<div className='container'>
					<div className='row'>
						{articles.map((element) => {
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
};

News.defaultProps = {
	country: 'in',
	pageSize: 5,
	category: 'general',
};

News.propTypes = {
	country: PropTypes.string,
	pageSize: PropTypes.number,
	category: PropTypes.string,
};

export default News;

// ac9c642fcf064e10bd492933357561ed
