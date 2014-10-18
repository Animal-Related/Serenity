(function(window) {
  var serenity = {};

  serenity.Player = (function() {
    var noteMap = {};

    function Player(notes, soundName) {
      // Takes:
      //  * an array of notes that represent the notes we want to download.
      //    i.e. "4-00" for C 4
      //         5-1 for C#4
      //         "4-01" for C#4
      //         "5-01" for D 5
      //  * the name of the sound. audio file format = {soundname}-{num}.ogg

      var filename, audio;

      // Preload the ogg files
      for (var i = 0, len = notes.length; i < len; i++) {
        filename = 'sounds/' + soundName + '-' + notes[i] + '.ogg';
        noteMap[notes[i]] = filename;
        audio = new Audio(filename);
      }

      console.log(noteMap);
      
      this.notes = notes;
    }


    Player.prototype.playNote = function(note, volume) {
      var audio = new Audio(noteMap[note]);
      audio.volume = volume || 1;
      audio.play();
    };

    return Player;
  }());

  // Export to window
  window.serenity = serenity;
}(window));

// C Major
var notes = [
  '4-00',
  '4-02',
  '4-04',
  '4-05',
  '4-07',
  '4-09',
  '4-11',
  '5-00'
  ];

var player = new window.serenity.Player(notes, 'pianoteq-vibraphone');
console.log(player);

// 00 C
// 02 D
// 04 E
// 05 F
// 07 G
// EDCD EEE DDD EGG EDCD EEE DDED C

var score = [
  '4-04','4-02','4-00','4-02',

  '4-04','4-04','4-04', false,

  '4-02','4-02','4-02', false,

  '4-04','4-07','4-07', false,

  '4-04','4-02','4-00','4-02',

  '4-04','4-04','4-04', false,

  '4-02','4-02','4-04','4-02',

  '4-00'
  ];

var play = function play(note) {
  if (note) {
    console.log(note);
    player.playNote(note);
  }
};

var i = 0;

var interval = setInterval(function() { 
  if (i > score.length) { clearInterval(interval); }

  play(score[i]);
  i++; 
}, 500);
