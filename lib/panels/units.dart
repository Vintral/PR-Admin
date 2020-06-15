import 'dart:math';

import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:pocket_realm_admin/config.dart';
import 'package:pocket_realm_admin/modals/item.dart';
import 'package:pocket_realm_admin/extensions/hover_extension.dart';
import 'package:pocket_realm_admin/modals/unit.dart';
import 'package:pocket_realm_admin/styles.dart';

class UnitsPanel extends StatefulWidget {
  @override
  _UnitsPanelState createState() => _UnitsPanelState();
}

class _UnitsPanelState extends State<UnitsPanel> {  
  List<dynamic> _units = List<dynamic>();

  void load() async {
    var url = Config.URL + 'units';
    var response = await http.get( url );        
    
    setState(() {
      _units = jsonDecode( response.body ) as List<dynamic>;
    });
  }

  Widget getContent() {
    if( _units.length == 0 ) {
      return Center(
        child: CircularProgressIndicator()
      );
    }

    return GridView.builder(
      padding: EdgeInsets.all( 10 ),
      physics: BouncingScrollPhysics(),
      itemCount: _units.length,
      gridDelegate: SliverGridDelegateWithMaxCrossAxisExtent(
        maxCrossAxisExtent: 200,
        crossAxisSpacing: 10,
        mainAxisSpacing: 10,
      ),
      itemBuilder: ( context, index ) {
        return GestureDetector(
          onTap: () async {
            bool result = await showDialog(
              context: context,
              builder: (_) => Dialog(
                child: UnitModal( data: _units[ index ] ),
              ),
              barrierDismissible: true,
              useRootNavigator: false,
            );

            if( result != null && result ) load();
          },
          child: Card(
            color: Colors.blue[300],
            elevation: _units[ index ][ 'available' ] == 1 ? 5 : 0,
            child: Image(
              image: NetworkImage( Config.ImageURL + 'units/' + _units[ index ][ 'type' ] + '.png?' + Random().nextDouble().toString() ),
            ),
          ).showCursorOnHover,
        );
      }
    );
  }

  @override
  void initState() {    
    super.initState();
    load();    
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          Container( 
            height: 100, 
            color:Colors.blue[400], 
            child: Row( 
              children: [
                SizedBox( width: 25 ),
                Text( 'UNITS', style:PRStyles.HeaderText ),
              ]
            ) 
          ),
          Expanded(
            child: getContent(),              
          )
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          var result = await showDialog(
            context: context,
            builder: (_) => Dialog(
              child: UnitModal(),
            ),
            barrierDismissible: true,
            useRootNavigator: false,
          );

          if( result != null && result ) load();
        },
        child: Icon( Icons.add ),
        backgroundColor: Colors.blue,
      ).showCursorOnHover,
    );
  }
}