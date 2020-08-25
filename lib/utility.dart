import 'dart:convert';

class Utility {
  static String since( int seconds, { bool ago = false } ) {
    double val = seconds.toDouble();

    if( seconds == 0 ) return "NOW";

    if( val < 60 ) return val.floor().toString() + ' ' + ( seconds > 1 ? "seconds" : "second" ) + ( ago ? ' ' + "ago" : '' );
    val /= 60;

    if( val < 60 ) return val.floor().toString() + ' ' + ( val.floor() > 1 ? "minutes" : "minute" ) + ( ago ? ' ' + "ago" : '' );
    val /= 60;

    if( val < 24 ) return val.floor().toString() + ' ' + ( val.floor() > 1 ? "hours" : "hour" ) + ( ago ? ' ' + "ago" : '' );
    val /= 24;

    return val.floor().toString() + ' ' + ( val.floor() > 1 ? "days" : "day" ) + ( ago ? ' ' + "ago" : '' );
  }

  static String decode( String input ) {
    return utf8.fuse( base64 ).decode( input );
  }

  static String encode( String input ) {
    return utf8.fuse( base64 ).encode( input );
  }
}