/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useEffect, memo, useState } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import {
  makeSelectRepos,
  makeSelectLoading,
  makeSelectError,
} from 'containers/App/selectors';
import { loadRepos } from '../App/actions';
import { changeUsername } from './actions';
import { makeSelectUsername } from './selectors';
import reducer from './reducer';
import saga from './saga';
import './index.css';
import socketIOClient from 'socket.io-client';
const socket = socketIOClient('http://localhost:4000');

function idUser(id, event) {
  socket.on('statusConnect', data => console.log(data));
  socket.emit(event, id);
}

function getDataUSer(id) {
  socket.on('getDataUsers', data => console.log(data));
  socket.emit('getDataUsers', id);
}

const key = 'home';

export function HomePage({
  username,
  loading,
  error,
  repos,
  onSubmitForm,
  onChangeUsername,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  const [userData, setUserData] = useState(false);
  useEffect(() => {
    // When initial state username is not null, submit the form to load repos

    // idUser(8, "statusConnect");

    setUserData(true);
  }, []);

  const reposListProps = {
    loading,
    error,
    repos,
  };

  return (
    <div className="container">
      <div className="table-wrapper">
        <div className="table-title">
          <div className="row">
            <div className="col-sm-5">
              <h2>
                User <b>Management</b>
              </h2>
            </div>
            <div className="col-sm-7">
              <a href="#" className="btn btn-primary">
                <i className="material-icons">&#xE147;</i>{' '}
                <span>Add New User</span>
              </a>
            </div>
          </div>
        </div>
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Birthday</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {socket.on('getDataUsers', data => {
              if (data.length > 0) {
                data.map((item, index) => {
                  <tr>
                    <td>{item.name}</td>
                    <td>
                      <a href="#">{item.email}</a>
                    </td>
                    <td>{item.phone}</td>
                    <td>{item.birthday}</td>
                    <td>
                      <span className="status text-warning">&bull;</span>
                      {item.status}
                    </td>
                    <td>
                      <a
                        href="#"
                        className="settings"
                        title="Settings"
                        data-toggle="tooltip"
                      >
                        <i className="material-icons">&#xE8B8;</i>
                      </a>
                      <a
                        href="#"
                        className="delete"
                        title="Delete"
                        data-toggle="tooltip"
                      >
                        <i className="material-icons">&#xE5C9;</i>
                      </a>
                    </td>
                  </tr>;
                });
              }
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

HomePage.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  repos: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  onSubmitForm: PropTypes.func,
  username: PropTypes.string,
  onChangeUsername: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  repos: makeSelectRepos(),
  username: makeSelectUsername(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onChangeUsername: evt => dispatch(changeUsername(evt.target.value)),
    onSubmitForm: evt => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(loadRepos());
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(HomePage);
