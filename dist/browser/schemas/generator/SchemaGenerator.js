'use strict';var _typeof2=require("babel-runtime/helpers/typeof"),_typeof3=_interopRequireDefault(_typeof2),_getIterator2=require("babel-runtime/core-js/get-iterator"),_getIterator3=_interopRequireDefault(_getIterator2),_slicedToArray2=require("babel-runtime/helpers/slicedToArray"),_slicedToArray3=_interopRequireDefault(_slicedToArray2),_entries=require("babel-runtime/core-js/object/entries"),_entries2=_interopRequireDefault(_entries);function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}var _=require("lodash"),randomString=require("randomstring"),Type=require("type-of-is"),RandExp=require("randexp"),_require=require("@identity.com/uca"),UCA=_require.UserCollectableAttribute,ucaDefinitions=_require.definitions,_require2=require("../../claim/Claim"),Claim=_require2.Claim,definitions=_require2.definitions,getBaseIdentifiers=_require2.getBaseIdentifiers,DRAFT="http://json-schema.org/draft-07/schema#",getPropertyNameFromDefinition=function(a){return getBaseIdentifiers(a.identifier).identifierComponents[2]},getPropertyType=function(a){return Type.string(a).toLowerCase()},processObject=function a(b,c,d){var e=c||{},f=b,g=f.definition;delete f.definition,e.type=getPropertyType(f),e.properties=e.properties||{};var h=(0,_entries2.default)(f),i=function(b,c){var f=getPropertyType(c);if("object"===f)e.properties[b]=a(c,e.properties[b],d+"."+b);else if("array"===f)e.properties[b]=processArray(c,e.properties[b],b);else if(e.properties[b]={},e.properties[b].type="null"===f?["null","string"]:f,g&&g.type.properties){var h=g.type.properties.find(function(a){return a.name===b});h&&h.type.includes(":")&&(h=definitions.find(function(a){return a.identifier===h.type})),e.properties[b]=addMinimumMaximum(h,e.properties[b])}else e.properties[b]=addMinimumMaximum(g,e.properties[b])},j=!0,k=!1,l=void 0;try{for(var m,n=(0,_getIterator3.default)(h);!(j=(m=n.next()).done);j=!0){var o=m.value,p=(0,_slicedToArray3.default)(o,2),q=p[0],r=p[1];i(q,r)}}catch(a){k=!0,l=a}finally{try{!j&&n.return&&n.return()}finally{if(k)throw l}}if(d.includes("claim")&&4===d.split(".").length){var s=d.substring(11),t=(s.substring(0,1).toUpperCase()+s.substring(1)).replace(".",":"),u=definitions.find(function(a){return a.identifier.includes(t)});if(null==u){var v=s.substring(0,1).toUpperCase()+s.substring(1);t="claim-cvc:"+v+"-v1",u=definitions.find(function(a){return a.identifier.includes(t)})}null==u&&(t="claim-cvc:"+s+"-v1",u=definitions.find(function(a){return a.identifier.includes(t)})),e.required=u.type.required}return e.additionalProperties=!1,e},processArray=function(a,b){var c=b||{};c.type=getPropertyType(a),c.items=c.items||{};var d=getPropertyType(a[0]);return c.items.type=d,c.additionalProperties=!1,c},process=function(a,b){var c=b,d=a.identifier,e=void 0,f={$schema:DRAFT};return f.title=d,f.type=Type.string(c).toLowerCase(),"object"===f.type&&(e=processObject(c,{},"root"),f.type=e.type,f.properties=e.properties),f.additionalProperties=!1,f},buildSampleJson=function(a){var b=!!(1<arguments.length&&void 0!==arguments[1])&&arguments[1],c={};return c=makeJsonRecursion(a,b),c},makeJsonRecursion=function a(b){var c=!!(1<arguments.length&&void 0!==arguments[1])&&arguments[1],d={},e=Claim.getTypeName(b);if("object"===(0,_typeof3.default)(b.type)&&void 0!==b.type.properties)b.type.properties.forEach(function(a){d[a.name]=generateRandomValueForType(a,c)});else if("Array"===e){var f=b.items.type,g=_.find(definitions,{identifier:f});d=[a(g,c)]}else if("Object"!==e){var h=getPropertyNameFromDefinition(b);d[h]="undefined"!=typeof b.pattern&&null!==b.pattern?new RandExp(b.pattern).gen():generateRandomValueForType(b,c)}else d=generateRandomValueForType(b,c);return c&&null==d.definition&&(d.definition=b),d},generateRandomNumberValueWithRange=function(a){var b=100*Math.random();return null!==a&&("undefined"!=typeof a.minimum&&null!==a.minimum&&b<a.minimum&&(b=a.minimum),"undefined"!==a.exclusiveMinimum&&null!==a.exclusiveMinimum&&b<=a.exclusiveMinimum&&(b=a.exclusiveMinimum+.1),"undefined"!=typeof a.maximum&&null!==a.maximum&&b>a.maximum&&(b=a.maximum),"undefined"!==a.exclusiveMaximum&&null!==a.exclusiveMaximum&&b>=a.exclusiveMaximum&&(b=a.exclusiveMaximum-.1)),b},generateRandomValueForType=function(a){var b=!!(1<arguments.length&&void 0!==arguments[1])&&arguments[1],c=a.type,d=a,e=c;return c.includes(":")&&(d=definitions.find(function(a){return a.identifier===c}),null==d?(d=ucaDefinitions.find(function(a){return a.identifier===c}),d&&(e=UCA.resolveType(d))):e=Claim.resolveType(d)),"String"===e?d.enum?_.values(d.enum)[0]:d&&d.pattern?new RandExp(d.pattern).gen():randomString.generate(10):"Number"===e?generateRandomNumberValueWithRange(d):"Boolean"===e?1===Math.round(Math.random()):makeJsonRecursion(d,b)},addMinimumMaximum=function(a,b){var c=b;return"undefined"!=typeof a&&null!==a&&(null!=a.exclusiveMinimum&&(c.exclusiveMinimum=a.exclusiveMinimum),null!=a.minimum&&(c.minimum=a.minimum),null!=a.exclusiveMaximum&&(c.exclusiveMaximum=a.exclusiveMaximum),null!=a.maximum&&(c.maximum=a.maximum)),c};module.exports={process:process,buildSampleJson:buildSampleJson};