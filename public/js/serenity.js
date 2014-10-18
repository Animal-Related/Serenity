(function() {
  var loadSounds = function loadSounds(notes, soundName) {
    // Takes:
    //  * an array of notes that represent the notes we want to download.
    //    i.e. "4-00" for C 4
    //         "4-01" for C#4
    //         "5-01" for D 5
    //  * the name of the sound. audio file format = {soundname}-{num}.ogg
    // Returns
    //  * an array of HTML audio elements of each of those notes

    var audioElem,
        filename,
        audios = {};

    for (var i = 0, len = notes.length; i < len; i++) {
      filename = 'public/sounds/' + soundName + '-' + notes[i] + '.ogg';
      audios[notes[i]] = new Audio(filename);
    }

    return audios;
  };
}());
