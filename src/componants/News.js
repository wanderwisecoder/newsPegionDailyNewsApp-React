import React, { Component } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';

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
  }


  constructor(props) {
    super(props);
    console.log('Constructor has been called from news Componant.');
    this.state = {
      articles: [],
      loading: false,
      page: 1,
    };
    document.title = `${this.capitalizeFirstLetter(this.props.category)} - NewsPegion`;
  }

  async updateNews() {
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=ac9c642fcf064e10bd492933357561ed&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    let parsedData = await data.json();
    console.log(parsedData);
    this.setState({
      articles: parsedData.articles,
      totalResults: parsedData.totalResults,
      loading: false
    });
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

  render() {
    console.log('render');
    return (
      <div className='container my-3'>
        <h1 className='text-center' style={{ margin: '35px 0px' }} >
          NewsPegion Daily - Top {this.capitalizeFirstLetter(this.props.category)} Headlines
        </h1>
        {this.state.loading && <Spinner />}
        <div className='row'>
          {!this.state.loading &&
            this.state.articles.map((element) => {
              return (
                <div className='col-md-4' key={element.url} >
                  <NewsItem title={element.title ? element.title : ''} description={element.description ? element.description.slice(0, 100) : ''} imageUrl={!element.urlToImage ? 'https://www.northampton.ac.uk/wp-content/uploads/2018/11/default-svp_news.jpg' : element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                </div>
              );
            })
          }
        </div>
        <div className='container d-flex justify-content-end grid gap-3'>
          <button disabled={this.state.page <= 1} type='button' className='btn btn-dark' onClick={this.handlePrevClick} > &larr; Previous </button>
          <button disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize)} type='button' className='btn btn-dark' onClick={this.handleNextClick} > Next &rarr; </button>
        </div>
      </div>
    );
  }
}

export default News;
