import 'package:eventify/eventify.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

class PlayersProvider extends EventEmitter {
  static final PlayersProvider _instance = PlayersProvider._internal();
  
  factory PlayersProvider() {
    return _instance;
  }

  PlayersProvider._internal() {
    debug( 'Created' );       
  }

  //================================//
  //  Properties                    //
  //================================//
  bool _debug = false;
  bool _loading = false;
  
  DateTime _loaded;
  List<dynamic> _data = List<dynamic>();

  //================================//
  //  Accessors                     //
  //================================//
  Future<List> get data async {
    return _data; 
  }  

  //================================//
  //  Handlers                      //
  //================================//


  //================================//
  //  Dispatchers                   //
  //================================//
  void emitLoaded() {
    _loading = false;
    emit( 'LOADED' );
  }

  //================================//
  //  Methods                       //
  //================================//
  Future<dynamic> load( { int page = 1 } ) async {
    debug( 'load: ' + page.toString() );

    var url = 'http://dev.admin.pocketrealm.hulaplatypus.com/api/v1/players';
    var response = await http.get( url );
    
    print( response.body );

    return jsonDecode( response.body );    
  }  

  void debug( msg ) {
    if( _debug )
      print( 'AvatarsProvider: ' + msg );
  }
}