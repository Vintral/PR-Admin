import 'dart:math';

import 'package:flutter/material.dart';
import 'package:pocket_realm_admin/components/navigation_item.dart';

class NavigationBar extends StatefulWidget {
  final Function handler;

  NavigationBar( this.handler );

  @override
  _NavigationBarState createState() => _NavigationBarState();
}

class _NavigationBarState extends State<NavigationBar> {
  String _tab = 'overview';

  void onTap( String tab ) {
    print( 'onTap: ' + tab );

    widget.handler( tab );
    setState(() {
      _tab = tab;
    });
  }

  @override 
  Widget build(BuildContext context) {
    return Container(
      color: Colors.blue[900],
      width: max( 200, min( 400, MediaQuery.of( context ).size.width / 4 ) ),
      height: MediaQuery.of( context ).size.height,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        children:[
          NavigationItem( 'overview', onTap, _tab ),
          Divider(color: Colors.blue[300], height: 2, ),
          NavigationItem( 'players', onTap, _tab ),
          Divider(color: Colors.blue[300], height: 2, ),
          NavigationItem( 'units', onTap, _tab),
          Divider(color: Colors.blue[300], height: 2, ),
          NavigationItem( 'buildings', onTap,  _tab ),
          Divider(color: Colors.blue[300], height: 2, ),
          NavigationItem( 'items', onTap,  _tab ),
          Divider(color: Colors.blue[300], height: 2, ),
          NavigationItem( 'contacts', onTap,  _tab ),
        ]
      )
    );  
  }
}