import 'dart:convert';

class Utility{
  static String decode( String input ) {
    return utf8.fuse( base64 ).decode( input );
  }

  static String encode( String input ) {
    return utf8.fuse( base64 ).encode( input );
  }
}