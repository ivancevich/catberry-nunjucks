/*
 * catberry-nunjucks
 *
 * Copyright (c) 2015 JC Ivancevich and project contributors.
 *
 * catberry-nunjucks's license follows:
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * This license applies to all parts of catberry-nunjucks that are not externally
 * maintained libraries.
 */

'use strict';

module.exports = TemplateProvider;

function TemplateProvider($nunjucks) {
	this._nunjucks = $nunjucks;
    this._templates = {};
    this._compiled = {};
}

/**
 * Current Nunjucks factory.
 * @type {Nunjucks}
 * @private
 */
TemplateProvider.prototype._nunjucks = null;

/**
 * Current set of registered templates.
 * @type {Object}
 * @private
 */
TemplateProvider.prototype._templates = null;

/**
 * Current set of compiled templates.
 * @type {Object}
 * @private
 */
TemplateProvider.prototype._compiled = null;

/**
 * Compiles (precompiles) Nunjucks template.
 * http://mozilla.github.io/nunjucks/api.html
 * @param {String} source Template source.
 * @returns {String} Precompiled source (template specification).
 */
TemplateProvider.prototype.compile = function (source, name) {
	this._compiled[name] = new this._nunjucks.Template(source);
	return this._nunjucks.precompileString(source, {
        name: name
    });
};

/**
 * Registers compiled (precompiled) Nunjucks template.
 * http://mozilla.github.io/nunjucks/api.html
 * @param {String} name Template name.
 * @param {String} compiled Compiled template source.
 */
TemplateProvider.prototype.registerCompiled = function (name, compiled) {
	this._templates[name] = this._compiled[name];
};

/**
 * Renders template with specified data.
 * @param {String} name Name of template.
 * @param {Object} data Data context for template.
 * @returns {*}
 */
TemplateProvider.prototype.render = function (name, data) {
	var self = this;
	return new Promise(function (fulfill, reject) {
		if (!self._templates.hasOwnProperty(name)) {
			reject(new Error('No such template'));
			return;
		}

		self._templates[name].render(data, function (error, html) {
			if (error) {
				reject(error);
				return;
			}
			fulfill(html);
		});
	});
};