/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2012, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

define(function(require, exports, module) {
    "use strict";

    var lang = require("../lib/lang");

    var tagMap = lang.createMap({
        url         : 'anchor',
        img         : 'image'
    });

    var oop = require("../lib/oop");
    var HtmlHighlightRules = require("./html_highlight_rules").HtmlHighlightRules;

    var HtmlBBCodeHighlightRules = function() {
        HtmlHighlightRules.call(this);

        var tags =  [{
            token : function(start, tag) {
                var group = tagMap[tag];
                return ["meta.tag.punctuation.begin",
                    "meta.tag.name" + (group ? "." + group : "")];
            },
            regex : "(\\[)([-_a-zA-Z0-9:]+)",
            next: "start_bbcode_tag_stuff"
        }, {
            token : function(start, tag) {
                var group = tagMap[tag];
                return ["meta.tag.punctuation.begin",
                    "meta.tag.name" + (group ? "." + group : "")];
            },
            regex : "(\\[/)([-_a-zA-Z0-9:]+)",
            next: "end_bbcode_tag_stuff"
        }];

        this.addRules({
            start_bbcode_tag_stuff: [
                {include : "bbcode_attributes"},
                {token : "meta.tag.punctuation.end", regex : "/?\\]", next : "start"}
            ],
            end_bbcode_tag_stuff: [
                {include : "space"},
                {token : "meta.tag.punctuation.end", regex : "\\]", next : "start"}
            ],
            bbcode_attributes: [{
                include : "space"
            }, {
                token : "keyword.operator.separator",
                regex : "=",
                push : [{
                    include: "space"
                }, {
                    token : "string",
                    regex : "[^\\]='\"\\s]+",
                    next : "pop"
                }, {
                    token : "empty",
                    regex : "",
                    next : "pop"
                }]
            }, {
                include : "string"
            }],
        });

        this.$rules.tag.unshift.apply(this.$rules.tag, tags);

        this.normalizeRules();
    };


    oop.inherits(HtmlBBCodeHighlightRules, HtmlHighlightRules);

    exports.HtmlBBCodeHighlightRules = HtmlBBCodeHighlightRules;
});