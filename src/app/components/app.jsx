import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

//components
import TopNav from './topNav/topNav.jsx';
import SideNav from './sideNav/sideNav.jsx';
import MainView from './mainView/mainView.jsx';
import GuestView from './guestView/guestView.jsx';
import Posts from './mainView/posts.jsx';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      signedIn: false,
      username: null,
      userId: null,
      allCategories: ['All'],
      currentCategory: 'All',
      tags: [],
      createPost: false,
      postData: {},
      postDataByVote: []
    }

    this.getUserFromSession();

    //to give the reference to 'this' the correct context
    this.setCreatePost  = this.setCreatePost.bind(this);
    this.updateUser     = this.updateUser.bind(this);
    this.updateCategory = this.updateCategory.bind(this);
    this.getCategories  = this.getCategories.bind(this);
    this.getPosts       = this.getPosts.bind(this);
    this.updatePostData = this.updatePostData.bind(this);
  }


  getUserFromSession() {
    axios.get('/api/session')
    .then(response => {
      if(response.status === 200) {
        this.setState({
          signedIn: true,
          username: response.data.user.username,
          userId: response.data.user.id
        });
      }
    });
  }

  getPosts() {
    //for access to 'this' in the async part of the calls
    var _this = this;

    axios.get('/api/posts', {
      params: {
        category: _this.state.currentCategory
      }
    })
    .then(function(response) {

      var rows = response.data.rows;
      // data is so we can update based on id
      // dataByVote is so we can display in the order they are sorted by the server/db
      // (desn't have to be sorted by votes, it can be anything you want by changing it
      // on the server side)
      var data = {};
      var dataByVote = [];

      for(var i = 0; i < rows.length; i++) {
        data[rows[i].id] = rows[i];
        dataByVote.push(rows[i]);
      }
      _this.setState({
        postData: data,
        postDataByVote: dataByVote
        // loaded: true
      });
    })
    .catch(function(err) {
      console.log(err);
    });
  }

  getCategories() {
    axios.get('/api/categories')
    .then(response => {
      var data = response.data;

      //default to always having an 'All' category. also the default for App's state.category
      var newCategories = ['All'];

      for(var i = 0; i < data.length; i++) {
        newCategories.push(data[i].name);
      }

      this.setState({allCategories: newCategories});
    });
  }

  //a flag to let MainView know if it should be showing the 'create post' view or not
  setCreatePost(e, boolValue) {
    this.setState({
      createPost: boolValue
    });
  }

  updateUser(boolValue, username, userId) {
    this.setState({
      signedIn: boolValue,
      username: username,
      userId: userId
    });
  }

  updateCategory(e, currentCategory) {
    e.preventDefault();

    this.setState({ currentCategory: currentCategory},
    // by passing this method to state, it will only run when the state has been
    // updated, kind of like a .then function
      this.getPosts);
  }

  updatePostData(data, dataByVote) {
    this.setState({
      postData: data,
      postDataByVote: dataByVote
    });
  }

  signedInView() {
    return (
      <div>
        <TopNav
        username={this.state.username}
        signedIn={this.state.signedIn}
        updateUser={this.updateUser}
        resetCategory={this.updateCategory}
        setCreatePost={this.setCreatePost}/>

        <SideNav
        getCategories={this.getCategories}
        currentCategory={this.state.currentCategory}
        allCategories={this.state.allCategories}
        updateCategory={this.updateCategory}/>

        <MainView
        userId={this.state.userId}
        currentCategory={this.state.currentCategory}
        allCategories={this.state.allCategories}
        postData={this.state.postData}
        postDataByVote={this.state.postDataByVote}
        getPosts={this.getPosts}
        updatePostData={this.updatePostData}
        createPost={this.state.createPost}
        setCreatePost={this.setCreatePost}/>
      </div>
    );
  }

  signedOutView() {
    console.log(this.state.signedIn);
    return (
      <div>
        {/*<TopNav
        signedIn={this.state.signedIn}
        updateUser={this.updateUser}/>*/}
        <GuestView
        updateUser={this.updateUser}/>
      </div>
    );
  }

  render() {
    //conditional rendering based on signedIn state
    return this.state.signedIn ? this.signedInView() : this.signedOutView();
  }
}



ReactDOM.render(<App />, document.getElementById('app'));





