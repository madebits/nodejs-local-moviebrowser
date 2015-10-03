import QtQuick 2.4
import QtQuick.Controls 1.3
import QtQuick.Window 2.2
import QtQuick.Dialogs 1.2

import "logic.js" as Logic

Item {
    id: item1
    x: 5; y: 5
    width: grid.cellWidth - 10; height: grid.cellHeight - 10

    MouseArea {
        id: mouse
        anchors.fill: parent
        onClicked: {
            grid.currentIndex = index;
        }
        onDoubleClicked: {
            //console.log("here" + index);
            Logic.open(url);
        }
        z:10
    }

    Column {
        anchors.fill: parent
        anchors.horizontalCenter: parent.horizontalCenter
        anchors.verticalCenter: parent.verticalCenter

        Text {
            text: title
            font.bold: true
            clip: truncated
            height: 30
            width: parent.width
        }

        Row {
            spacing: 5
            Image {
                asynchronous: true
                source: poster
                height: 120
            }
            Column{
                spacing: 5
                Text {
                    text: runTime.toString() + " min"
                }

                Text {
                    text: " Votes: " + vote.toString()
                }

                Button {
                    text: "Play"
                    iconSource:  "images/play.png"
                    onClicked: {
                        console.log("clicked");
                        Logic.open(url)
                    }
                    z: 100
                }
            }
        }

        TextArea {
            text: overview
            readOnly: true
            height: 150
            width: parent.width
        }
    }



}
