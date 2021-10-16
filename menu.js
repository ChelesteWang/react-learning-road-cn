var sidebarTxt = '- [**主页**](/README.md)\n';
var path = require('path');
var fs = require('fs');
var curPath = path.resolve('./');
var curPathList = []

function walkSync(currentDirPath, callback) {
    var fs = require('fs'),
        path = require('path');
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
            callback(filePath, stat);
        } else if (stat.isDirectory() && !filePath.includes(".git")) {
            // 增加目录的层级，并加粗显示目录名
            var subPath = filePath.substr(curPath.length + 1);
            var pathArr = subPath.split("/");
            for (var i = 1; i < pathArr.length; i++) {
                sidebarTxt += '  ';
            }
            sidebarTxt += '- **' + name + '**\n';
            var subPathName = './' + name + '/'
            console.log((path.resolve(subPathName)))
            walkSync((path.resolve(subPathName)), callback);
        }
    });
}

function a() {
    function fileDisplay(filePath) {
        //根据文件路径读取文件，返回文件列表
        fs.readdir(filePath, function (err, files) {
            if (err) {
                console.warn(err);
            } else {
                //遍历读取到的文件列表
                files.forEach(function (filename) {
                    //获取当前文件的绝对路径
                    var filedir = path.join(filePath, filename);
                    //根据文件路径获取文件信息，返回一个fs.Stats对象
                    fs.stat(filedir, function (eror, stats) {
                        if (eror) {
                            console.warn("获取文件stats失败");
                        } else {
                            var isFile = stats.isFile(); //是文件
                            var isDir = stats.isDirectory(); //是文件夹
                            if (isFile) {
                                if ("_" != path.basename(filePath).substr(0, 1)
                                    && path.basename(filePath).includes(`.md`)) {
                                    console.log(filePath)
                                    var relativeFilePath = filePath.substr(curPath.length + 1);// 这里取得相对路径 直接删除'/'
                                    if (relativeFilePath == path.basename(filePath)) {
                                        sidebarTxt += `- [**${relativeFilePath}**](${relativeFilePath})\n`
                                    }
                                }
                            }
                            if (isDir) {
                                console.log(filedir);
                                // curPathList.push("./" + filedir);
                                sidebarTxt += '- **' + filedir + '**\n';
                                fileDisplay(filedir); //递归，如果是文件夹，就继续遍历该文件夹下面的文件
                            }
                        }
                    });
                });
            }
        });
    }
    fileDisplay("./");
}

// a()

walkSync(curPath, function (filePath, stat) {
    if (".md" == path.extname(filePath).toLowerCase()
        && "_" != path.basename(filePath).substr(0, 1)
        && path.basename(filePath).includes(`.md`)) {
        var relativeFilePath = filePath.substr(curPath.length + 1);
        sidebarTxt += `- [**${relativeFilePath}**](${relativeFilePath})\n`
    }
});


fs.writeFile(path.resolve('./') + '/_sidebar.md', sidebarTxt, function (err) {
    if (err) {
        //console.error(err);
    }
});