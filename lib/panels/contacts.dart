import 'dart:math';

import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:pocket_realm_admin/components/contact_submission.dart';
import 'package:pocket_realm_admin/components/pointer.dart';
import 'package:pocket_realm_admin/config.dart';
import 'package:pocket_realm_admin/modals/item.dart';
import 'package:pocket_realm_admin/modals/unit.dart';
import 'package:pocket_realm_admin/styles.dart';

class ContactsPanel extends StatefulWidget {
  @override
  _ContactsPanelState createState() => _ContactsPanelState();
}

class _ContactsPanelState extends State<ContactsPanel> {  
  List<dynamic> _contacts = List<dynamic>();

  void load() async {
    var url = Config.URL + 'contacts';
    var response = await http.get( url );
    print( response.body );
    
    setState(() {
      _contacts = jsonDecode( response.body ) as List<dynamic>;
    });
  }

  Widget getContent() {
    if( _contacts.length == 0 ) {
      return Center(
        child: CircularProgressIndicator()
      );
    }

    return GridView.builder(
      padding: EdgeInsets.all( 10 ),
      physics: BouncingScrollPhysics(),

      itemCount: _contacts.length,
      gridDelegate: SliverGridDelegateWithMaxCrossAxisExtent(
        maxCrossAxisExtent: 400,
        crossAxisSpacing: 10,
        mainAxisSpacing: 10,
        childAspectRatio: 1.8,
      ),
      itemBuilder: ( context, index ) {
        return Card(
          color: Colors.blue[300],
          child: ContactSubmission( _contacts[ index ] ),
        );
      }
    );
  }

  @override
  void initState() {
    load();
    super.initState();
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
                Text( 'CONTACTS', style:PRStyles.HeaderText ),
              ]
            ) 
          ),
          Expanded(
            child: getContent(),              
          )
        ],
      ),
    );
  }
}