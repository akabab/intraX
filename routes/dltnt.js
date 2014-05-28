// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   dltnt.js                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: adjivas <adjivas@student.42.fr>            +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2014/05/24 21:52:28 by adjivas           #+#    #+#             //
//   Updated: 2014/05/24 21:52:29 by adjivas          ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

'use strict';

var express = require('express');
var router = express.Router();

var bcrypt = require('bcrypt-nodejs');

var easymongo = require('easymongo');
var mongo = new easymongo({dbname: 'db'});
var accounts = mongo.collection('accounts');

Array.prototype.pst_next = function() {
  return (this[++this.current]);
};
Array.prototype.pst_prev = function() {
  return (this[--this.current]);
};
Array.prototype.pre_next = function() {
  return (this[this.current++]);
};
Array.prototype.pre_prev = function() {
  return (this[this.current--]);
};
Array.prototype.current = 0;

/* 00.
** All variables.
*/

var D_ERR_DLTNT_EMPTY = 'please, select a member.';

/* 01.
** The function returns void and puts the page with member's list.
*/

function dltnt_putmember(argument)
{
  'use strict';


  accounts.find({}, function(error, results) {
  	'use strict';

    if (argument['method'] == 'get')
      argument['res'].render('dltnt', {results: results});
    else if (argument['method'] == 'post') {
      argument['res'].end('dltnt');
    }
    return ;
  });
  return ;
}

/* 02.
** The root loads the page fragment -GET-.
*/

router.get('/', function (req, res) {
  return (dltnt_putmember({res: res, method: 'get'}))
});

/* 03.
** The function returns void and deletes the member list.
*/

function dltnt_erasemember(argument) {
  'use strict';
  var member;
  var members = argument['members'];
  var res = argument['res'];

  if (typeof members != "object")
    member = argument['members'];
  else {
    member = argument['members'][0];
    members.shift();
  } if (member.length == 24) {
    accounts.findById(member, function(error, results) {
      'use strict';

      if (typeof results == "object") {
        if (results['accessRights'] != Infinity) {
          accounts.removeById(results['_id'], function(error, results) {
            'use strict';

            if (members.length) {
              return (dltnt_erasemember({members: members, res: res}));
            }
          });
        }
      }
    });
  }
  return (dltnt_putmember({res: res, method: 'post'}));
}

/* 04.
** The root deletes the members -POST-.
*/

router.post('/', function (req, res) {
  if (!req.body.members)
    res.end(D_ERR_DLTNT_EMPTY);
  else {
    dltnt_erasemember({members: req.body.members, res: res});
  }
  return ;
});

module.exports = router;
