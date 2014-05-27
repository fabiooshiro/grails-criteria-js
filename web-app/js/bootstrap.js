var belaBartok = {name: 'Béla Bartók', id: 1};
var radioHead = {name: 'Radio Head', id: 2};
//Criteria.addData('Artist', [belaBartok, radioHead]);
Criteria.data.Artist = [belaBartok, radioHead];
var album = {artist: belaBartok, id: 1, class: 'criteria.js.Album'};
var album2 = {artist: radioHead, year: 2000, id: 2, class: 'criteria.js.Album'};
//Criteria.addData('Album', [album, album2]);
Criteria.data.Album = [album, album2];

/*
Criteria.addData('Music', [
	{album: album, date: '2013-01-01', time: 100.0, name: 'A', id: 1, class: 'criteria.js.Music'},
	{album: album, date: '2013-01-02', time:  20.0, name: 'B', id: 2, class: 'criteria.js.Music'},
	{album: album, date: '2013-01-03', time:   3.0, name: 'C', id: 3, class: 'criteria.js.Music'},
	{album: album2, date: '2013-01-04', time: 2.2, name: 'Idioteque', id: 4, class: 'criteria.js.Music'},
	{album: album2, date: '2013-01-05', time: 5.4, name: 'OK Computer', id: 5, class: 'criteria.js.Music'}
]);
*/

Criteria.data.Music = [
	{album: album, date: '2013-01-01', time: 100.0, name: 'A', id: 1, class: 'criteria.js.Music'},
	{album: album, date: '2013-01-02', time:  20.0, name: 'B', id: 2, class: 'criteria.js.Music'},
	{album: album, date: '2013-01-03', time:   3.0, name: 'C', id: 3, class: 'criteria.js.Music'},
	{album: album2, date: '2013-01-04', time: 2.2, name: 'Idioteque', id: 4, class: 'criteria.js.Music'},
	{album: album2, date: '2013-01-05', time: 5.4, name: 'OK Computer', id: 5, class: 'criteria.js.Music'}
];
