'use strict';

let cheerio = require('cheerio').load;
let utils = require('./utils');
let colors = require('colors');



/*
 * Parser构造函数
 * @param html {string} 待解析html字符串
 */
function Parser(html){
    this.title = '';
    this.summy = '';
    this.chapters = [];
    this.init(html);
}

/*
 * 初始化方法
 * @param  h {string } 待解析html字符串
 */
Parser.prototype.init = function(h){
    this.$ = cheerio(h);
    this.title = utils.trim(this.$('title').text());
}


/*
 * 提取页面指定视频链接
 * @return {Array}
 */
Parser.prototype.getLink = function(){
    let self = this;
    self.$('.chapter').each(function(e,i){
        let temp = {};
        temp['chapterName'] = utils.trim(self.$(i).find('h3 strong').text());
        temp['item'] = [];
        self.$(this).find('.video li a').each(function(e,ii){
            let linkTemp = {};
            linkTemp['name'] = utils.trim(self.$(this).text());
            linkTemp['url'] = self.$(this).attr('href');
            temp['item'].push(linkTemp);
        })
        self.chapters.push(temp);
    })
    return self.chapters;
}

/*
 * 获取查找结果
 * @return {Array}
 */
Parser.prototype.getInfo = function(){
    let self = this;
    let course = [];
    self.$('.introduction').each(function(e,i){
        let temp = {};
        temp['title'] = self.$(this).find('h2 a').text();
        temp['description'] = self.$(this).find('.description').text().substring(0,50) + '...';
        temp['url'] = 'http://www.imooc.com'+self.$(this).find('h2').find('h2 a').attr('href');
        temp['id'] = self.$(this).find('h2').find('h2 a').attr('href').match(/\/learn\/(\d+)/)[1];
        course.push(temp);
    })
    return course;
}


module.exports = Parser;