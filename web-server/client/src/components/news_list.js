import React, {Component} from 'react';
import {connect} from 'react-redux';
import {fetchNews} from '../actions';
import NewsItem from './news_item';
import { Link } from 'react-router-dom';

class NewsList extends Component{
  componentDidMount(){
    const pageNum = this.props.match.params.pageNum;
    this.props.fetchNews(pageNum);
  }

  componentDidUpdate(prevProps){
    if (this.props.location !== prevProps.location){
      const pageNum = this.props.match.params.pageNum;
      this.props.fetchNews(pageNum);
    }
  }

  renderNewsList(){
    return this.props.newslist.map((news)=>{
      return (<NewsItem key={news.digest} news={news} />);
    });
  }

  renderPageNavigation(){
    let MAX_PAGE = 10
    const pageNum = parseInt(this.props.match.params.pageNum,10);
    if(!isNaN(pageNum)){
      if(pageNum === 1){
        return (
          <Link className="btn btn-primary" to="/news/2">Next</Link>
        );
      }
      else if(pageNum === MAX_PAGE){
        return (
          <Link className="btn btn-primary" to={`/news/${MAX_PAGE-1}`}>Back</Link>
        );
      }
      else{
        return (
          <div>
            <Link className="btn btn-primary mr-1" to={`/news/${pageNum-1}`}>Back</Link>
            <Link className="btn btn-primary" to={`/news/${pageNum+1}`}>Next</Link>
          </div>
        );
      }
    }

  }

  render(){
    console.log(this.props.newslist);
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-auto list-group">
              {this.renderNewsList()}
          </div>
        </div>
        <div className="row d-flex flex-row justify-content-center" style={{"margin": "10px 5px"}}>
          {this.renderPageNavigation()}
        </div>
      </div>

    );
  }
}

function mapPropsToState(state){
  return {
    newslist: state.newslist
  };
}

export default connect(mapPropsToState,{fetchNews})(NewsList);
