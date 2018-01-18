const Crawler = require("crawler");
const fs = require('fs');

let c = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            let $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            let selection1 = $('.content > ol > li > table > tr > td > ul ').toArray();
            let result1 = [];
            for (let i = 0; i < selection1.length; i++) {
                result1.push({
                    index: i + 1,
                    context: '',
                    source: ''
                })
                for (let j = 0; j < selection1[i].children.length; j++) {
                    for (let k = 0; k < selection1[i].children[j].children.length - 4; k++) {
                        if (selection1[i].children[j].children[k].type == 'text') result1[i].context += selection1[i].children[j].children[k].data;
                        if (selection1[i].children[j].children[k].type == 'tag' && k !== selection1[i].children[j].children.length - 5) result1[i].context += selection1[i].children[j].children[k].children[0].data;
                        if (k == selection1[i].children[j].children.length - 5) result1[i].source = selection1[i].children[j].children[k].children[0].data;
                    }
                }
            }
            console.log(result1);    
            fs.writeFileSync('output-' + Date.now() + '.json', JSON.stringify(result1));
        }
        done();
    }
});

let search = encodeURIComponent(process.argv[2]);

// Queue just one URL, with default callback
c.queue(`http://search1.ruscorpora.ru/search.xml?env=alpha&mycorp=&mysent=&mysize=&mysentsize=&mydocsize=&dpp=&spp=&spd=&text=lexform&mode=main&sort=gr_tagging&lang=ru&nodia=1&req=${search}`);
