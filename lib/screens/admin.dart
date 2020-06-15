import 'package:flutter/material.dart';
import 'package:pocket_realm_admin/components/navigation_bar.dart';
import 'package:pocket_realm_admin/panels/buildings.dart';
import 'package:pocket_realm_admin/panels/items.dart';
import 'package:pocket_realm_admin/panels/players.dart';
import 'package:pocket_realm_admin/panels/units.dart';

class AdminPage extends StatefulWidget {
  @override
  _AdminPageState createState() => _AdminPageState();
}

class _AdminPageState extends State<AdminPage> {
  String _tab = 'overview';

  void onChange( String tab ) {
    print( 'onChange: ' + tab );

    setState( () {
      _tab = tab;
    } );
  }

  Widget getContent() {
    switch( _tab ) {
      case 'overview': return Container( child: Center( child: Text( 'Overview' ) ) );
      case 'players': return PlayerPanel();
      case 'units': return UnitsPanel();
      case 'buildings': return BuildingsPanel();
      case 'items': return ItemsPanel();
    }

    return Container();
  }

  @override
  void initState() {    
    super.initState();    
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        NavigationBar( onChange ),        
        Expanded(
          child: getContent(),
        ),
      ],
    );
  }
}