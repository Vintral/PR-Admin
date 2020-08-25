import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:pocket_realm_admin/config.dart';
import 'package:pocket_realm_admin/styles.dart';
import 'package:pocket_realm_admin/utility.dart';

class ContactModal extends StatefulWidget {
  final int id;

  ContactModal( this.id );

  @override  
  _ContactModalState createState() => _ContactModalState();
}

class _ContactModalState extends State<ContactModal> {
  bool _debug = true;
  bool loaded = false;
  double width = 700.0;
  BuildContext _context;
  String avatar = "";  
  String username = "";
  String _message = "";
  List<dynamic> messages = List<dynamic>();
  TextEditingController _textController = TextEditingController();

  retrieve() async {
    print( Config.URL + 'contact/' + widget.id.toString() );

    var response = await http.get( 
      Config.URL + 'contact/' + widget.id.toString(),
      headers: <String,String> {
        'Content-Type': 'application/json; charset=UTF-8',
      }
    );

    var data = jsonDecode( response.body ) as dynamic;
    print( response.body );

    print( data[ "avatar" ] );

    avatar = data[ "avatar" ];
    username = data[ "username" ];

    messages = data[ "messages" ] as List<dynamic>;
    print( messages.length.toString() );

    setState( () { loaded = true; } );
  }

  void onChanged( String val ) {
    debug( 'onChanged: ' + val );
    _message = val;
  }

  Future<void> onSend() async {
    debug( 'onSend' );
    FocusScope.of( _context ).unfocus();

    var response = await http.post( 
      Config.URL + 'contact/' + widget.id.toString() + "/reply",
      headers: <String,String> {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode( {
        "message": _message
      } )
    );
    
    print( response.body == "OK" );
    _textController.clear();

    messages.add( { "sender": 1, "message": Utility.encode( _message ) } );
    _message = "";

    setState( () {} );
  }

  Widget getChatWidget( int index ) {
    debug( "getChatWidget: " + index.toString() );
    debug( "Width: " + MediaQuery.of( context ).size.width.toString() );

    print( messages[ index ] );

    var message = "";
    try{
      message = Utility.decode( messages[ index ][ "message" ] );
    } catch( err ) { message = messages[ index ][ "message" ]; }

    return Container(
      constraints: BoxConstraints(
        maxWidth: width * .75,
      ),
      alignment: messages[ index ][ "sender" ] == 1 ? Alignment.centerRight : Alignment.centerLeft,
      child: Text( message ),
    );
  }

  @override
  Future<void> initState() {
    retrieve();    
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    _context = context;

    if( !loaded ) return Container(
      padding: EdgeInsets.symmetric( horizontal: 20, vertical: 10 ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          SizedBox( width: 30, height:30, child: CircularProgressIndicator() ),
          SizedBox( width: 10 ),  
          Container(
            child: Text( "Loading Contact...", style:PRStyles.LoadingText )
          ),
        ],        
      ),
    );

    return SizedBox(
      width: 700,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: EdgeInsets.symmetric( horizontal: 10, vertical: 5 ),
            color: Colors.blue[ 900 ],
            child: Text( username, style:PRStyles.HeaderText )
          ),
          Container(
            constraints: BoxConstraints(
              maxWidth: width,
              minHeight: 300,
              maxHeight: 600
            ),
            child: ListView.builder(
              itemCount: messages.length,
              itemBuilder: ( context, i ) => getChatWidget( i ),
            )
          ),
          Row(
              mainAxisSize: MainAxisSize.max,
              crossAxisAlignment: CrossAxisAlignment.end,
              children:[
                Expanded(
                  child: Container(                    
                    color: Colors.grey,
                    child: TextFormField(
                      style: TextStyle( color: Colors.white ),   
                      keyboardType: TextInputType.multiline,
                      maxLines: null,
                      controller: _textController,
                      onChanged: onChanged,
                      textInputAction: TextInputAction.send,
                      onFieldSubmitted: (term) {
                        //onSendMessage();
                      },
                    ),
                  ),
                ),
                RaisedButton(
                  onPressed: onSend,
                  child: Text( "SEND" ),
                )
              ],
            ),
        ],
      ),
    );
  }

  void debug( String msg, { bool force = false, bool silence = false } ) {
    if( silence ) return;
    if( _debug || force ) 
      print( 'ContactModal: ' + msg );
  }
}