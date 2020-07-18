import 'dart:convert';

import 'package:auto_size_text/auto_size_text.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:pocket_realm_admin/extensions/hover_extension.dart';
import 'package:pocket_realm_admin/config.dart';
import 'package:pocket_realm_admin/styles.dart';

class PlayerModal extends StatefulWidget {
  final String username;

  PlayerModal( this.username );

  @override
  _PlayerModalState createState() => _PlayerModalState();
}

class _PlayerModalState extends State<PlayerModal> {
  bool _loading = true;
  bool _loadingRound = false;
  bool _debug = true;
  dynamic data = null;
  dynamic log = null;

  bool _dupesOpened = false;
  bool _ipsOpened = false;
  bool _logsOpened = false;

  int _page;
  int _maxPages;

  String _email;  
  String _username;
  String _gems;
  String _round = '0';
  String _tab = 'info';

  Widget getHeader( String title, { List<Widget> children } ) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.all( 15 ),
      color: Colors.blue[ 300 ],
      child: Row(
        children:[
          Expanded(
            child: Text( title, style:PRStyles.ModalHeaderText ),
          ),
          if( children != null ) ...children
        ]
      )
    );
  }

  void onNotificationChanged( String type, bool value ) {
    switch( type ) {
      case 'dupes': setState( () {
        _dupesOpened = value;
      } ); break;
      case 'ips': setState( () {
        _ipsOpened = value;
      } ); break;
      case 'logs': setState( () {
        _logsOpened = value;
      } ); break;
    }
  }

  Widget getDupes() {
    List<Widget> widgets = List<Widget>();
    List<dynamic> dupes = data[ 'dupes' ] as List<dynamic>;
        
    dupes.forEach( ( dupe ) {
      widgets.add( Container(
        decoration: BoxDecoration(
          border: Border.all(
            color: Colors.blue,           
          )
        ),
        child: GestureDetector(
          onTap: () {
            Navigator.pop( context );
            showDialog(
              context: context,
              builder: (_) => Dialog(
                child: PlayerModal( dupe[ 'username' ] ),
              ),
              barrierDismissible: true,
              useRootNavigator: true,
            );
          },
          child:Stack(
            children: [
              Image(
                width: 75,
                image: NetworkImage( Config.ImageURL + 'avatars/' + dupe[ 'avatar' ] + '.png' ),
              ),
              Positioned(
                bottom: 0,                
                child: Container(
                  width: 75,
                  padding: EdgeInsets.symmetric( horizontal: 5 ),
                  color: Colors.blue[ 400 ],
                  child: Center(
                    child: AutoSizeText(
                      dupe[ 'username' ],
                      maxLines: 1,
                      style: PRStyles.ButtonText,
                    )
                  ),
                ),
              ),
            ],
          )
        ),
      ) );
    } );
    
    return AnimatedContainer(
      duration: Duration( milliseconds: 200 ),      
      padding: EdgeInsets.all( 15 ),
      child: Container(
        width: double.infinity,
        child: Wrap(     
          alignment: WrapAlignment.start,
          spacing: 10,
          runSpacing: 10,        
          children: [
            ...widgets
          ],
        )
      ),
    );
  }

  Widget getRoundDropdown() {
    List<dynamic> rounds = data[ 'rounds' ] as List<dynamic>;

    return DropdownButton(
      onChanged: (String value) {
        if( _round != value ) {
          _round = value;
          getRoundData();
          setState( () { _loadingRound = true; } );
        }
      },
      items: rounds
      .map<DropdownMenuItem<String>>((dynamic value) {        
        return DropdownMenuItem<String>(
          value: value.toString(),
          child: Text(value.toString()),
        );
      } ).toList(),
    );
  }

  Widget getRoundLog() {
    if( _loadingRound ) {
      return Center(
        child: CircularProgressIndicator(),
      );
    }

    if( log != null ) {
      List<dynamic> logs = log[ 'log' ] as List<dynamic>;
      List<Widget> widgets = List<Widget>();      

      for( int i = 0; i < logs.length; i++ ) {        
        widgets.add(
          Container(
            padding: EdgeInsets.symmetric( vertical: 10, horizontal: 15 ),
            color: i % 2 == 0 ? Colors.white : Colors.blue[ 50 ],
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text( logs[ i ][ 'action' ] ),
                Text( since( logs[ i ][ 'time' ] ) ),
              ],
            )
          )
        );
      }
      
      return Column(
        children: [
          ...widgets
        ]
      );      
    }
    
    return Container();
  }

  void onTab( String type ) {
    setState( () {
      _tab = type;
    } );
  }

  Widget getTab( String type ) {
    return Expanded(
      child: GestureDetector(
        onTap: () => onTab( type ),
        child: Container(
          padding: EdgeInsets.all( 15 ),
          color: type == _tab ? Colors.lightBlue[ 300 ] : Colors.lightBlue[ 100 ],
          child: Center(
            child: Text( type, style:PRStyles.HeaderText ),
          )
        ),
      )
    );
  }

  String since( int seconds, { bool ago = false } ) {
    double val = seconds.toDouble();

    if( val < 60 ) return val.floor().toString() + ' second' + ( seconds > 1 ? 's' : '' ) + ( ago ? ' ago' : '' );
    val /= 60;

    if( val < 60 ) return val.floor().toString() + ' minute' + ( val.floor() > 1 ? 's' : '' ) + ( ago ? ' ago' : '' );
    val /= 60;

    if( val < 24 ) return val.floor().toString() + ' hour' + ( val.floor() > 1 ? 's' : '' ) + ( ago ? ' ago' : '' );
    val /= 24;

    return val.floor().toString() + ' day' + ( val.floor() > 1 ? 's' : '' ) + ( ago ? ' ago' : '' );    
  }

  Widget getTabBar() {
    return Row(
      mainAxisSize: MainAxisSize.max,
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        getTab( 'info' ),
        getTab( 'logs' ),
      ],
    );
  }

  Widget getIPs() {
    List<Widget> widgets = List<Widget>();
    List<dynamic> ips = data[ 'ips' ] as List<dynamic>;

    ips.forEach( ( ip ) {
      widgets.add( Text( ip[ 'ip' ] ) );
    } );
    
    return AnimatedContainer(
      duration: Duration( milliseconds: 200 ),      
      padding: EdgeInsets.all( 15 ),
      child: Container(
        width: double.infinity,
        child: Wrap(     
          alignment: WrapAlignment.start,
          spacing: 10,
          runSpacing: 10,        
          children: [
            ...widgets
          ],
        )
      ),
    );
  }

  Widget getPagination() {
    print( 'getPagination' );
    print( _page.toString() );
    print( _maxPages.toString() );

    List<Widget> pages = List<Widget>();

    for( var i = -10; i <= 10; i++ ) {
      if( ( ( _page + i ) <= 0 ) || _page + i > _maxPages ) pages.add( Container() );
      else {
        pages.add( GestureDetector(
          onTap: () {
            print( 'TAPPED ON PAGE' );
            getRoundData( page: _page + i );
          },
          child: Container(
            child: Text( ( _page + i ).toString() ),
          )
        ).showCursorOnHover );
      }
    }

    return Center(
      child: SizedBox(
        width: 600,
        child: Row( 
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,      
          children: [
            ...pages
          ],
        ),
      ),
    );
  }

  List<Widget> getDisplay() {
    List<Widget> ret = List<Widget>();

    switch( _tab ) {
      case 'info':
        ret.add( getHeader( 'Dupes' ) );
        ret.add( getDupes() );
        ret.add( SizedBox( height: 15 ) );
        ret.add( getHeader( 'IPs' ) );
        ret.add( getIPs() );
        break;
      case 'logs':
        ret.add( getHeader( '', children: [
          getRoundDropdown(),      
        ] ) );
        ret.add( getRoundLog() );
        ret.add( SizedBox( height: 15 ) );
        ret.add( getPagination() );
        ret.add( SizedBox( height: 15 ) );
        break;
    }    

    return ret;
  }

  Widget getContent() {
    if( _loading ) {
      return Container(
        height: 100,
        width: 200,
        color: Colors.blue[ 300 ],
        padding: EdgeInsets.all( 20 ),
        child: Center(
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            crossAxisAlignment: CrossAxisAlignment.center,
            children:[
              CircularProgressIndicator(),
              Text( 'Loading...', style:PRStyles.NavigationText ),
            ]
          )
        )
      );
    }

    return Container(
      width: 1000,
      color: Colors.blue[ 100 ],
      child: Column(
        children: [
          getHeader( 'Information' ),
          Container(
            color: Colors.yellow[ 50 ],
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Image(
                  width: 250,
                  image: NetworkImage( Config.ImageURL + 'avatars/' + data[ 'avatar' ] + '.png' ),
                ),
                Expanded(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,                
                    children:[
                      Padding(
                        padding: EdgeInsets.all( 15 ),
                        child: TextFormField(
                          decoration: InputDecoration(
                            labelText: 'Username',
                            border: OutlineInputBorder(),
                          ),
                          onChanged: ( value ) {
                            _username = value;
                          },
                          initialValue: data[ 'username' ],
                        ),
                      ),
                      Padding(
                        padding: EdgeInsets.all( 15 ),
                        child: TextFormField(
                          decoration: InputDecoration(
                            labelText: 'Gems',
                            border: OutlineInputBorder(),
                          ),
                          onChanged: ( value ) {
                            _gems = value;
                          },
                          initialValue: data[ 'gems' ].toString(),
                        ),
                      ),
                    ],
                  ),
                ),
                Expanded(
                  child: Container(
                    height: 250,
                    color: Colors.green[ 50 ],
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Padding(
                          padding: EdgeInsets.all( 15 ),
                          child: TextFormField(
                            decoration: InputDecoration(
                              labelText: 'Email',
                              border: OutlineInputBorder(),
                            ),
                            onChanged: ( value ) {
                              _email = value;
                            },
                            initialValue: data[ 'email' ],
                          ),
                        ),
                        Padding(
                          padding: EdgeInsets.all( 15 ),
                          child: RaisedButton(
                            onPressed: () {},
                            child: Text( 'SAVE' ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ]
            ),
          ),
          SizedBox( height: 15 ),
          getTabBar(),
          Expanded(             
            child: ListView(
              
              children:[
                ...getDisplay()                
              ]
            ),
          ),
        ]          
      ),
    );
  }

  void getPaginationValues() {
    print( 'getPaginationValues' );
    print( data );
    _page = data[ 'page' ];
    _maxPages = data[ 'pages' ];
  }

  Future<dynamic> load() async {    
    var url = 'http://dev.admin.pocketrealm.hulaplatypus.com/api/v1/player/' + widget.username;
    var response = await http.get( url );
    
    data = jsonDecode( response.body );
    print( data );
    getPaginationValues();

    setState( () {
      _loading = false;
    } );
  }

  Future<dynamic> getRoundData( { int page = 1 } ) async {
    debug( 'getRoundData: ' + page.toString() );

    var url = 'http://dev.admin.pocketrealm.hulaplatypus.com/api/v1/player/' + widget.username + '/' + _round + '/' + page.toString();
    var response = await http.get( url );
    
    log = jsonDecode( response.body );
    _page = log[ 'page' ];
    _maxPages = log[ 'maxPages' ];

    setState( () {
      _loadingRound = false;
    } );
  }


  @override
  void initState() {
    super.initState();
    debug( 'initState' );
    load();
    getRoundData();
  }

  @override
  Widget build(BuildContext context) {
    debug( 'build' );
    debug( 'IPS: ' + _ipsOpened.toString() );
    return getContent();    
  }

  void debug( String msg ) {
    if( _debug )
      print( 'PlayerModal: ' + msg );
  }
}