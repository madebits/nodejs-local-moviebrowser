import QtQuick 2.4
import QtQuick.Controls 1.3
import QtQuick.Window 2.2
import QtQuick.Dialogs 1.2

import "logic.js" as Logic

ApplicationWindow {
    title: qsTr("Local Movies")
    visible: true
    visibility: "Maximized"

    property ListModel items: ListModel {}

    function init() {
        Logic.init(function(m){
            items.append(m);
        });
    }

    menuBar: MenuBar {
        Menu {
            title: qsTr("&File")
            MenuItem {
                text: qsTr("&Refresh")
                onTriggered: {
                    items.clear()
                    init()
                }
            }
            MenuItem {
                text: qsTr("E&xit")
                onTriggered: Qt.quit();
            }
        }
    }

    MainForm {
        anchors.fill: parent
        grid.model: items
        Component.onCompleted: init()
    }

    MessageDialog {
        id: messageDialog
        title: qsTr("May I have your attention, please?")

        function show(caption) {
            messageDialog.text = caption;
            messageDialog.open();
        }
    }
}
