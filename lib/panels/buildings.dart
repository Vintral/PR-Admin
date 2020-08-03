import 'dart:math';

import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:pocket_realm_admin/components/pointer.dart';
import 'package:pocket_realm_admin/config.dart';
import 'package:pocket_realm_admin/modals/building.dart';
import 'package:pocket_realm_admin/styles.dart';

class BuildingsPanel extends StatefulWidget {
  @override
  _BuildingsPanelState createState() => _BuildingsPanelState();
}

class _BuildingsPanelState extends State<BuildingsPanel> {  
  List<dynamic> _buildings = List<dynamic>();

  void load() async {
    var url = Config.URL + 'buildings';
    var response = await http.get( url );        
    
    setState(() {
      _buildings = jsonDecode( response.body ) as List<dynamic>;
    });
  }

  Widget getContent() {
    if( _buildings.length == 0 ) {
      return Center(
        child: CircularProgressIndicator()
      );
    }

    return GridView.builder(
      padding: EdgeInsets.all( 10 ),
      physics: BouncingScrollPhysics(),
      itemCount: _buildings.length,
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
                child: BuildingModal( data: _buildings[ index ] ),
              ),
              barrierDismissible: true,
              useRootNavigator: false,
            );

            if( result != null && result ) load();
          },
          child: PointerCursor(
            child: Card(
              color: Colors.blue[300],
              elevation: _buildings[ index ][ 'available' ] == 1 ? 5 : 0,
              child: Image(
                image: NetworkImage( 
                  Config.ImageURL + 'buildings/' + _buildings[ index ][ 'type' ] + '.png?' + Random().nextDouble().toString()                 
                ),
              ),
            ),
          ),
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
                Text( 'BUILDINGS', style:PRStyles.HeaderText ),
              ]
            ) 
          ),
          Expanded(
            child: getContent(),              
          )
        ],
      ),
      floatingActionButton: PointerCursor(
        child: FloatingActionButton(
          onPressed: () async {
            var result = await showDialog(
              context: context,
              builder: (_) => Dialog(
                child: BuildingModal(),
              ),
              barrierDismissible: true,
              useRootNavigator: false,
            );

            if( result != null && result ) load();
          },
          child: Icon( Icons.add ),
          backgroundColor: Colors.blue,
        ),
      ),
    );
  }
}