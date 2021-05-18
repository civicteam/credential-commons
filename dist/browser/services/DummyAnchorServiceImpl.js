'use strict';var _promise=require("babel-runtime/core-js/promise"),_promise2=_interopRequireDefault(_promise),_regenerator=require("babel-runtime/regenerator"),_regenerator2=_interopRequireDefault(_regenerator),_stringify=require("babel-runtime/core-js/json/stringify"),_stringify2=_interopRequireDefault(_stringify),_asyncToGenerator2=require("babel-runtime/helpers/asyncToGenerator"),_asyncToGenerator3=_interopRequireDefault(_asyncToGenerator2);function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}var uuid=require("uuid/v4"),logger=require("../logger");function DummyAnchorServiceImpl(a,b){var c=this;this.config=a,this.http=b;var d=function(){var a=(0,_asyncToGenerator3.default)(_regenerator2.default.mark(function a(b){var e;return _regenerator2.default.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.prev=0,a.next=3,c.http.request({url:b,method:"GET",simple:!0,json:!0});case 3:if(e=a.sent,e&&e.type){a.next=8;break}return a.next=7,d(b);case 7:return a.abrupt("return",a.sent);case 8:if(!(e&&"permanent"!==e.type)){a.next=11;break}return e.statusUrl=b,a.abrupt("return",e);case 11:return a.abrupt("return",e);case 14:throw a.prev=14,a.t0=a["catch"](0),logger.error("Error polling: "+b,(0,_stringify2.default)(a.t0,null,2)),new Error("Error polling: "+b);case 18:case"end":return a.stop();}},a,c,[[0,14]])}));return function(){return a.apply(this,arguments)}}();return this.anchor=(0,_asyncToGenerator3.default)(_regenerator2.default.mark(function a(){var b=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{};return _regenerator2.default.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.abrupt("return",_promise2.default.resolve({subject:{pub:"xpub:dummy",label:b.subject&&b.subject.label?b.subject.label:null,data:b.subject&&b.subject.data?b.subject.data:null,signature:"signed:dummy"},walletId:"none",cosigners:[{pub:"xpub:dummy"},{pub:"xpub:dummy"}],authority:{pub:"xpub:dummy",path:"/"},coin:"dummycoin",tx:new uuid,network:"dummynet",type:"temporary",civicAsPrimary:!1,schema:"dummy-20180201"}));case 1:case"end":return a.stop();}},a,c)})),this.update=function(){var a=(0,_asyncToGenerator3.default)(_regenerator2.default.mark(function a(b){return _regenerator2.default.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return b.type="permanent",b.value=uuid(),a.abrupt("return",_promise2.default.resolve(b));case 3:case"end":return a.stop();}},a,c)}));return function(){return a.apply(this,arguments)}}(),this.verifySignature=function(){return!0},this.verifySubjectSignature=function(){return!0},this.verifyAttestation=(0,_asyncToGenerator3.default)(_regenerator2.default.mark(function a(){return _regenerator2.default.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.abrupt("return",!0);case 1:case"end":return a.stop();}},a,c)})),this.revokeAttestation=function(){var a=(0,_asyncToGenerator3.default)(_regenerator2.default.mark(function a(b){return _regenerator2.default.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return b.revoked=!0,a.abrupt("return",_promise2.default.resolve(b));case 2:case"end":return a.stop();}},a,c)}));return function(){return a.apply(this,arguments)}}(),this.isRevoked=function(a){return!!a.revoked&&a.revoked},this}module.exports={CurrentCivicAnchor:DummyAnchorServiceImpl};