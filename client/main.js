import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import './main.html';

function getMediaUrl(sound) {
    if (device.platform.toLowerCase() === "android") {
        console.log('device is android');
        return cordova.file.applicationDirectory.replace('file://', '') + 'www/application/app/' + sound.substr(1);
    } else {
        console.log('device is iOS');
        //return cordova.file.applicationDirectory.replace('file://', '') + sound.substr(1);
        return cordova.file.applicationDirectory.replace('file://', '') + 'www/application/app/' + sound.substr(1);
    }
}

function playSound(sound) {
    return new Media(
        getMediaUrl(sound),

        function (success) {
            console.log('success');
        },
        function (error) {
            console.log(error);
        }
    );
}

Template.main.onCreated(function() {
    Session.set('isPlaying', false);
    if (Meteor.isCordova) {
        // document.addEventListener("deviceready", onDeviceReady, false);
        //
        // function onDeviceReady() {
        //     alert(Media);
        // }

        //var path = document.location.origin + '/local-filesystem/www/application/app/guitar.mp3';

        // getLocalPath = function(file) {
        //     return cordova.file.applicationDirectory.replace('file://', '') + 'www/application/app/' + file;
        // };
        //
        // var path = getLocalPath('guitar.mp3');
        //
        // test = new Media(path);

        test = playSound('/sounds/guitar.mp3');
    }
});

Template.main.helpers({
    message() {
        return Session.get("messsage");
    },
    origin() {
        console.log(document.location.origin);
        return document.location.origin;
    },
    duration() {
        return test.getDuration();
    },
    isPlaying() {
        if (Session.get("isPlaying")) {
            return Session.get("isPlaying");
        }
    }
});

Template.main.events({
    'click .play'(event) {
        Session.set('isPlaying', true);
        test.play({playAudioWhenScreenIsLocked: true});
    },
    'click .pause'(event) {
        Session.set('isPlaying', false);
        test.pause();
    },
    'click .stop'(event) {
        Session.set('isPlaying', false);
        test.stop();
    },
    'click .release'(event) {
        test.release();
    },
    'click .forward'(event) {
        test.seekTo(2500);
    },
    'click .backward'(event) {
        test.seekTo(10);
    },
    'click .download'(event) {
        var file = this;
        console.log(file);

        var fileUrl = "https://pbs.twimg.com/profile_images/727884265648750592/IwS_IWls.jpg";
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
            var fileTransfer = new FileTransfer();
            var offlineId = Random.id();
            console.log(fileSystem.root);

            console.log(fileSystem.root.toURL());

            var path = fileSystem.root.toURL() + offlineId + "-" + file.fileName;
            fileTransfer.download(
                fileUrl,
                path,
                function(entry) {
                    console.log("Success " + path);
                    console.log(entry);


                    console.log(WebAppLocalServer.localFileSystemUrl(path));
                    // OfflineFiles.insert({
                    //     _id: offlineId,
                    //     fileId: file._id,
                    //     name: file.name,
                    //     fileName: file.fileName,
                    //     type: file.type,
                    //     fsPath: path
                    // });
                    //console.log(OfflineFiles.findOne(offlineId));
                },
                function(error) {
                    console.log("Error during download. Code = " + error.code);
                }
            );
        });
    },
});
