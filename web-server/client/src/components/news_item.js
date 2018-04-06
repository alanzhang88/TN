import React, {Component} from 'react';
import {connect} from 'react-redux';
import {logClick} from '../actions';

class NewsItem extends Component{

  onClickLog(){
    if(this.props.user.email){
      // console.log("Logged in send click log");
      this.props.logClick(this.props.news.class);
    }
  }

  render(){
    return (
      <a style={{"cursor": "pointer", "margin": "10px 0px"}}
         className="list-group-item list-group-item-action clearfix flex-column"
         href={this.props.news.url}
         target="_blank"
         onClick={this.onClickLog.bind(this)}
      >
        <div className="d-flex w-100 justify-content-between">
          <h5 className="list-group-item-heading mr-2" dangerouslySetInnerHTML={{__html:this.props.news.title}}></h5>
          <small>{new Date(this.props.news.publishedAt).toLocaleString()}</small>
        </div>
        <div className="d-flex w-100 justify-content-left">
          <img src={this.props.news.urlToImage} alt={this.props.news.title} className="img-responsive mr-2" style={{"height": "100px", "width": "150px"}}/>
          <textarea disabled value={this.props.news.description} className="list-group-item-text" cols={100}
            style={{"border": "none", "backgroundColor": "transparent", "resize":"none", "cursor":"pointer","overflow": "hidden"}}></textarea>
        </div>
      </a>
    );
  }
}

function mapPropsToState(state){
  return {
    user: state.user
  };
}

export default connect(mapPropsToState,{logClick})(NewsItem);
