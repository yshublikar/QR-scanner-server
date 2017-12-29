var config = require('../config/config');
var request = require('request')
var fs = require('fs');
var photos = [];

var scanner = {
    upload: function(req, res) {
        if (req.files && req.files.length > 0) {
            for(var i=0; i<req.files.length; i++){
                modifyImage(req.files[i],req.files.length, i, function(result){
                    if(result){
                        console.log("Image write successfully")
                        res.status(200).json({ status: 'success', message: 'uploaded successfully' });
                    }
                })
            }
        } else {
            console.log("pictures is undefined.");
            res.status(500).json({ status: 'error', message: 'Something went wrong' });

        }

    }
}

function modifyImage(file, len, index, callback) {
    var filename = file.filename + ".jpg";
    photos.push({'file': config.apiUrl + filename});
    var path = 'public/' + filename;

    fs.readFile('./temp/' + file.filename, (err, imageBuffer) => {
        if (err) throw err;

        fs.writeFile(path, imageBuffer, function(err) {
            if (err) {
                callback(false);
                console.log("Error while saving profile picture", err)
            } else {
                fs.unlink('./temp/' + file.filename, (err) => {
                    if (err) throw err;
                    if((len-1) == index){
                        createPdfUsingPictures(photos, function(result){
                            if(result== true){
                                photos.length = 0;
                                callback(true)            
                            }else{
                                callback(false)
                            }
                        })
                        
                    }
                    
                });
            }
        });
    });
}

function createPdfUsingPictures(images, callback) {
        var data = {};

        data.pictureArray = images;



        data.arrayLength = data.pictureArray.length - 1;
        data.header = { "height": "2mm" };
        data.format = "letter";
        data["defaultFooter"] = { "height": "2mm", "defaultContent": "<span></span>" };

        console.log("data=============");
        console.log(data.header);
        console.log(data);
        console.log("PDF DOC Connecting to --- " + config.pdfDocUrl);
        var options = {
            method: 'POST',
            url: config.pdfDocUrl + 'secure/html2PDF/5a0acd9ee1aaaa04ef10b839',
            headers: {
                'content-type': 'application/json'
            },
            body: data || {},
            json: true
        };

        request(options, function(error, response, body) {
            if (error) {
                console.log("error----");
                console.log(error);
                callback(false);
            } else if (response.statusCode == 200) {
                console.log("body----");
                console.log(body);
                callback(true);
                // callback(null, body.naturalURL);
            } else {
                console.log("response----");
                console.log(response);
                callback(false);
                // callback(response, null);
            }
        })



    }

module.exports = scanner;