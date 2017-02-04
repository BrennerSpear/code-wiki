import React from 'react';

export default class MainHeader extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="row">
        <div className="col-sm-4">
          <h3>{this.props.category}</h3>
        </div>
        <div className="col-sm-8 text-right">
          <span>Filter By: </span>
          <ul className="tag-list">
            <li>Debugging</li>
          </ul>
          <span className="add-filter"><a href="#">add filter</a></span>
        </div>
      </div>
    );
  }
}