import QtQuick 2.4
import QtQuick.Controls 1.3
import QtQuick.Layouts 1.1

Item {
    property alias grid: gridView

    GridView {
        id: gridView
        transformOrigin: Item.TopLeft
        anchors.fill: parent
        cellWidth: 310
        cellHeight: 310
        delegate: LocalMovie {}
        highlight: Rectangle { color: "lightsteelblue"; radius: 5 }
    }

}
