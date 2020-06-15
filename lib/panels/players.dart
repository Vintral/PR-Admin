import 'package:flutter/material.dart';
import 'package:pocket_realm_admin/components/display_item.dart';
import 'package:pocket_realm_admin/config.dart';
import 'package:pocket_realm_admin/modals/player.dart';
import 'package:pocket_realm_admin/providers/players.dart';
import 'package:pocket_realm_admin/extensions/hover_extension.dart';
import 'package:pocket_realm_admin/styles.dart';

class PlayerPanel extends StatefulWidget {
  @override
  _PlayerPanelState createState() => _PlayerPanelState();
}

class _PlayerPanelState extends State<PlayerPanel> {
  PlayersProvider _provider = PlayersProvider();
  List<dynamic> _players = List<dynamic>();

  void load() async {
    dynamic data = await _provider.load();
    setState(() {
      _players = data as List<dynamic>;
    });
  }

  Widget getContent() {
    if( _players.length == 0 ) {
      return Center(
        child: CircularProgressIndicator()
      );
    }

    return GridView.builder(
      padding: EdgeInsets.all( 10 ),
      physics: BouncingScrollPhysics(),
      itemCount: _players.length,
      gridDelegate: SliverGridDelegateWithMaxCrossAxisExtent(
        maxCrossAxisExtent: 200,
        crossAxisSpacing: 10,
        mainAxisSpacing: 10,
      ),
      itemBuilder: ( context, index ) {
        return GestureDetector(
          onTap: () { 
            print( 'TAPPED ON PLAYER' ); 
            showDialog(
              context: context,
              builder: (_) => Dialog(
                child: PlayerModal(),
              ),
              barrierDismissible: true,
              useRootNavigator: false,
            );
          },
          child: DisplayItem(
            child: Stack(
              children: [
                Image(
                  image: NetworkImage( Config.ImageURL + 'avatars/' + _players[ index ][ 'avatar' ] + '.png' ),
                ),
                Align(
                  alignment: Alignment.bottomCenter,
                  child: Container(
                    height: 30,
                    color: Colors.black.withOpacity( 0.5 ),
                    child: Center(                      
                      child: Text( _players[ index ][ 'username' ] ),
                    )
                  ),
                )
              ],
            )
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
      body: Container(
        child: Column(
          children: [
            Container( 
              height: 100, 
              color:Colors.blue[400], 
              child: Row( 
                children: [
                  SizedBox( width: 25, ),
                  Text( 'PLAYERS', style:PRStyles.HeaderText ),
                ]
              ) 
            ),
            Expanded(
              child: getContent(),              
            )
          ],
        )
      ),
    );
  }
}