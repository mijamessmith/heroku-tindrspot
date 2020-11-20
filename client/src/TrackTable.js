import React, { useState } from 'react';
import MaterialTable from "material-table";

export default function TrackTable(props) {
    var { data } = props;
    const columns = [
        {
            title: "Artist",
            field: 'artist'
        },
        {
            title: "Track",
            field: 'track'
        },
        {
            title: "Album",
            field: 'album'
        }
    ]

    return (
        <MaterialTable title="Liked Tracks" data={data} columns={columns}
            options={{
                sorting: true,
                toolbar: false,
                doubleHorizontalScroll: true,
                pageSizeOptions: [5, 10],
                actionsCellStyle: {
                    fontFamily: 'Bangers, cursive'
                },
                headerStyle: {
                    fontSize: "25px",
                    fontWeight: "700",
                    backgroundColor: "#2DE2E6",
                    fontFamily: 'Bangers, cursive'
                },
                rowStyle: {
                    fontSize: "20px",
                    color: "red"
                }
            }}
        />
        )
}