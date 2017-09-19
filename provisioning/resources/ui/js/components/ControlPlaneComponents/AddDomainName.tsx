/*
 * Copyright (c) 2016-2017 Snowplow Analytics Ltd. All rights reserved.
 *
 * This program is licensed to you under the Apache License Version 2.0,
 * and you may not use this file except in compliance with the Apache License Version 2.0.
 * You may obtain a copy of the Apache License Version 2.0 at http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the Apache License Version 2.0 is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Apache License Version 2.0 for the specific language governing permissions and limitations there under.
 */

/// <reference path="../../../typings/node/node.d.ts" />
/// <reference path="../../../typings/react/react.d.ts" />
/// <reference path="../../../typings/react/react-dom.d.ts" />
/// <reference path="../.././Interfaces.d.ts"/>

import React = require('react');
import ReactDOM = require("react-dom");
import AlertContainer from 'react-alert';
import alertOptions from './AlertOptions'
import axios from 'axios';

var alertContainer = new AlertContainer();

export default React.createClass({
  getInitialState () {
    return {
      domain_name: '',
      disabled: false
    };
  },

  handleChange(evt) {
    if (evt.target.name == 'domain_name'){
      this.setState({
        domain_name: evt.target.value
      });
    }
  },

  sendFormData()  {
    var _this = this;
    var alertShow = alertContainer.show
    var domainName = this.state.domain_name

    // this function will be given to the config of the axios
    // When status isn't between 200 and 300, axios throws
    // error as default. With this 'validateStatus' function,
    // valid status interval changes to between 200 and 500
    function validateStatus(status) {
      return status >= 200 && status < 500
    }

    // there is no need to disabled false after
    // because connection will be lost after request is sent
    // and page will be loaded again
    _this.setState({
      disabled: true
    });
    var params = new URLSearchParams();
    params.append('domain_name', _this.state.domain_name);
    params.append('tls_status', "on");

    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    axios.post('/control-plane/add-domain-name', params, {validateStatus: validateStatus})
    .then(function (response) {
      _this.setState({
        domain_name: "",
      });
      if (response.status == 405) {
        alertShow(response.data, {
          time: 2000,
          type: 'error'
        });
      } else {
        alertShow('You will lose connection after submitting the domain name \
                   because of server restarting. Reload the page after submission.', {
          time: 10000,
          type: 'info'
        });
      }
    })
    .catch(function (error) {
        alert('Unexpected error, you need to hard reset the server');
    });
  },

  handleSubmit(event) {
    var alertShow = alertContainer.show
    alertShow('Please wait...', {
      time: 2000,
      type: 'info'
    });
    event.preventDefault();
    this.sendFormData();
  },

  render() {
    return  (
      <div className="tab-content">
        <h4>Add domain name for TLS: </h4>
        <form action="" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="domain_name">Domain name: </label>
            <input className="form-control" name="domain_name" ref="domain_name" required type="text" onChange={this.handleChange} value={this.state.domain_name} />
          </div>
          <div className="form-group">
            <button className="btn btn-primary" type="submit" disabled={this.state.disabled}>Submit</button>
          </div>
        </form>
        <AlertContainer ref={a => alertContainer = a} {...alertOptions} />
      </div>
    );
  }
});
