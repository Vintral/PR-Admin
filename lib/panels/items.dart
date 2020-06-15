import 'dart:math';

import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:pocket_realm_admin/components/display_item.dart';
import 'package:pocket_realm_admin/config.dart';
import 'package:pocket_realm_admin/modals/item.dart';
import 'package:pocket_realm_admin/extensions/hover_extension.dart';
import 'package:pocket_realm_admin/styles.dart';

class ItemsPanel extends StatefulWidget {
  @override
  _ItemsPanelState createState() => _ItemsPanelState();
}

class _ItemsPanelState extends State<ItemsPanel> {  
  List<dynamic> _items = List<dynamic>();

  void load() async {
    var url = Config.URL + 'items';
    var response = await http.get( url );        
    
    setState(() {
      _items = jsonDecode( response.body ) as List<dynamic>;
    });
  }

  Widget getContent() {
    if( _items.length == 0 ) {
      return Center(
        child: CircularProgressIndicator()
      );
    }

    return GridView.builder(
      padding: EdgeInsets.all( 10 ),
      physics: BouncingScrollPhysics(),
      itemCount: _items.length,
      gridDelegate: SliverGridDelegateWithMaxCrossAxisExtent(
        maxCrossAxisExtent: 200,
        crossAxisSpacing: 10,
        mainAxisSpacing: 10,
      ),
      itemBuilder: ( context, index ) {
        print( _items[ index ][ 'available ' ] );
        return GestureDetector(
          onTap: () async {
            bool result = await showDialog(
              context: context,
              builder: (_) => Dialog(
                child: ItemModal( data: _items[ index ] ),
              ),
              barrierDismissible: true,
              useRootNavigator: false,
            );

            if( result != null && result ) load();
          },

          child: DisplayItem( 
            available: _items[ index ][ 'available' ] == 1, 
            child: Image(
              image: NetworkImage( Config.ImageURL + 'items/' + _items[ index ][ 'type' ] + '.png?' + Random().nextDouble().toString() ),
            ),
          )
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
                Text( 'ITEMS', style:PRStyles.HeaderText ),
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
              child: ItemModal(),
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