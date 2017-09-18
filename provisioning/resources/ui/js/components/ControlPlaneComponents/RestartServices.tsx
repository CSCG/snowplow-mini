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
import axios from 'axios';

export default React.createClass({
  getInitialState () {
    return {
      disabled: false
    };
  },

  restartAllServices(): void {
    var _this = this

    _this.setState({
      disabled: true
    });

    alert('Restarting all services...');

    axios.put('/control-plane/restart-services', {}, {})
    .then(function (response) {
      _this.setState({
        disabled: false
      });
      alert('All services are restarted successfully');
    })
    .catch(function (error) {
      _this.setState({
        disabled: false
      });
      alert('Error while restarting services, you need to hard reset your server');
    });
  },

  render() {
    return (
      <div className="tab-content">
        <h4> Clear the cache for iglu schemas: </h4>
        <button type="button" onClick={this.restartAllServices} disabled={this.state.disabled}>Restart all services</button>
      </div>
    );
  }
});
