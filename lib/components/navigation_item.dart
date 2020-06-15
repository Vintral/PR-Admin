import 'package:flutter/material.dart';
import 'package:pocket_realm_admin/extensions/hover_extension.dart';
import 'package:pocket_realm_admin/styles.dart';

class NavigationItem extends StatelessWidget {
  final String text;
  final Function handler;
  final String active;

  NavigationItem( this.text, this.handler, this.active );

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
        child: GestureDetector(
        onTap: () { handler( text ); },
        child: Container(
          height: 100,
          color: active == text ? Colors.blue[500] : Colors.blue[800],
          child: Center(
            child: Text( 
              text[ 0 ].toUpperCase() + text.substring( 1 ).toLowerCase(),
              style: active == text ? PRStyles.NavigationTextActive : PRStyles.NavigationText
            )
          )
        ),
      )
    ).showCursorOnHover;
  }
}