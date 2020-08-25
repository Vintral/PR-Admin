import 'package:auto_size_text/auto_size_text.dart';
import 'package:flutter/material.dart';
import 'package:pocket_realm_admin/config.dart';
import 'package:pocket_realm_admin/modals/contact.dart';
import 'package:pocket_realm_admin/styles.dart';
import 'package:pocket_realm_admin/utility.dart';

class ContactSubmission extends StatelessWidget {
  final dynamic data;

  ContactSubmission( this.data );

  @override
  Widget build(BuildContext context) {
    var msg = "";

    try {
      msg = Utility.decode( data[ "message" ] );
    } catch( err ) { msg = data[ "message" ]; }

    var shadow = 15.0;

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [          
          BoxShadow(
            color: Colors.blue,
            blurRadius: shadow,
            spreadRadius: shadow,
            offset: Offset( shadow, shadow ),
          )
        ]
      ),
      child: Column(
        children: [
          Container(
            padding: EdgeInsets.symmetric( vertical: 5, horizontal: 10 ),
            color: Colors.blue[ 800 ],
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text( data[ "username" ], style:PRStyles.ContactHeaderText ),
                Text( Utility.since( data[ "since" ] ), style:PRStyles.ContactHeaderText ),
              ],
            )
          ),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Image(
                width: 75,
                image: NetworkImage( Config.ImageURL + 'avatars/' + data[ "avatar" ] + '.png' ),
              ),
              Container( 
                padding: EdgeInsets.all( 5 ),
                child: AutoSizeText(
                  msg,
                  wrapWords: true,
                  style: PRStyles.ContactBodyText,
                  maxLines: 3,
                  minFontSize: 12,
                  overflow: TextOverflow.ellipsis,
                )
              ),
            ],
          ),
          SizedBox( height: 5 ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              RaisedButton(
                color: Colors.blue[ 700 ],
                onPressed: () async {
                  bool result = await showDialog(
                    context: context,
                    builder: (_) => Dialog(
                      child: ContactModal( data[ "id" ] ),
                    ),
                    barrierDismissible: true,
                    useRootNavigator: false,
                  );
                },
                child: Text( "REPLY", style:PRStyles.ButtonText ),
              ),
              RaisedButton(
                color: Colors.red,
                onPressed: () async {
                  bool result = await showDialog(
                    context: context,
                    builder: (_) => Dialog(
                      child: Text( "DELETE MODAL" ),
                    ),
                    barrierDismissible: true,
                    useRootNavigator: false,
                  );
                },
                child: Text( "DELETE", style:PRStyles.ButtonText ),
              )
            ],
          )
        ],
      ),
    );
  }
}