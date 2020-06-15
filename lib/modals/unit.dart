import 'dart:convert';
import 'dart:html';
import 'dart:math';
import 'dart:typed_data';
import 'package:http/http.dart' as http;

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:pocket_realm_admin/config.dart';
import 'package:pocket_realm_admin/styles.dart';
import 'package:pocket_realm_admin/utility.dart';

class UnitModal extends StatefulWidget {
  final dynamic data;

  UnitModal( { this.data } );
  
  @override
  State<StatefulWidget> createState() => _UnitModalState();
}

class _UnitModalState extends State<UnitModal> {
  final ImagePicker _picker = ImagePicker();
  Uint8List uploadedImage;

  BuildContext _context;

  TextEditingController _name = TextEditingController();
  TextEditingController _plural = TextEditingController();
  TextEditingController _attack = TextEditingController();
  TextEditingController _defense = TextEditingController();
  TextEditingController _health = TextEditingController();
  TextEditingController _costGold = TextEditingController();
  TextEditingController _costPoints = TextEditingController();
  TextEditingController _upkeepGold = TextEditingController();
  TextEditingController _upkeepFood = TextEditingController();
  TextEditingController _position = TextEditingController();
  FocusNode _nameField = FocusNode();
  FocusNode _pluralField = FocusNode();
  FocusNode _attackField = FocusNode();
  FocusNode _defenseField = FocusNode();
  FocusNode _healthField = FocusNode();
  FocusNode _costGoldField = FocusNode();
  FocusNode _costPointsField = FocusNode();
  FocusNode _upkeepGoldField = FocusNode();
  FocusNode _upkeepFoodField = FocusNode();
  FocusNode _positionField = FocusNode();

  bool _recruitable = false;
  bool _ranged = false;
  bool _available = false;
  
  void pickFile() async {
    InputElement uploadInput = FileUploadInputElement();
    uploadInput.click();
    uploadInput.onChange.listen((e) {
      // read file content as dataURL
      final files = uploadInput.files;
      if (files.length == 1) {
        final file = files[0];
        FileReader reader =  FileReader();

        reader.onLoadEnd.listen((e) {
          setState(() {            
            uploadedImage = reader.result;            
            setState( () {} );
          });
        });

        reader.onError.listen( ( fileEvent ) {
          print( 'ERROR' );          
        } );

        reader.readAsArrayBuffer(file);
      }
    });
  }

  Image getImage() {
    if( uploadedImage != null ) {
      return Image(
        image: MemoryImage( uploadedImage ),
      );
    }

    return Image(
      image: NetworkImage( 
        widget.data != null
          ? Config.ImageURL + 'units/' + widget.data[ 'type' ] + '.png?' + Random().nextDouble().toString() 
          : Config.ImageURL + 'items/none.png' 
      ),
    );
  }

  dynamic getPayload() {
    dynamic ret = {};

    if( widget.data != null ) ret[ 'id' ] = widget.data[ 'id' ] as int;
    if( uploadedImage != null ) ret[ 'image' ] = base64Encode( uploadedImage );
    ret[ 'name' ] = _name.text;
    ret[ 'plural' ] = _plural.text;
    ret[ 'attack' ] = _attack.text;    
    ret[ 'defense' ] = _defense.text;
    ret[ 'health' ] = _health.text;
    ret[ 'cost_gold' ] = _costGold.text;
    ret[ 'cost_points' ] = _costPoints.text;
    ret[ 'upkeep_gold' ] = _upkeepGold.text;
    ret[ 'upkeep_food' ] = _upkeepFood.text;
    ret[ 'recruitable' ] = _recruitable;
    ret[ 'ranged' ] = _ranged;
    ret[ 'available' ] = _available;
    ret[ 'display_position' ] = _position.text;
    
    return ret;
  }

  Future<http.Response> onSave() async {
    return http.post( 
      Config.URL + 'units' + ( widget.data == null ? '/add' : '' ),
      headers: <String,String> {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode( getPayload() )
    );
  }

  Future<http.Response> onDelete() async {
    return http.post( 
      Config.URL + 'units/delete',
      headers: <String,String> {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode( {
        'id': widget.data[ 'id' ] as int
      } )
    );
  }

  void onCancel() {
    print( 'onCancel' );
    closeDialog();
  }

  void onConfirm() {
    print( 'onConfirm' );
    closeDialog();
  }

  void closeDialog() {
    Navigator.of( _context ).pop();
  }

  Widget getTextField( BuildContext context, TextEditingController controller, FocusNode node, String label, FocusNode next, { bool expanded = false } ) {
    Widget widget = TextField(
      controller: controller,
      focusNode: node,
      decoration: InputDecoration(
        labelText: label,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular( 5 ),
          borderSide: BorderSide(
            color: Colors.blue,
            width: 1,
          )
        )
      ),
      onSubmitted: (_) {
        node.unfocus();
        if( next != null ) FocusScope.of( context ).requestFocus( next );
      },
    );
        

    if( expanded ) return Expanded(
      child: widget
    );

    return widget;
  }

  @override
  void initState() {    
    super.initState();

    print( widget.data );
    if( widget.data != null ) {      
      _name = TextEditingController( text: widget.data[ 'name' ] );
      _plural = TextEditingController( text: widget.data[ 'plural' ].toString() );
      _attack = TextEditingController( text: widget.data[ 'attack' ].toString() );
      _defense = TextEditingController( text: widget.data[ 'defense' ].toString() );
      _health = TextEditingController( text: widget.data[ 'health' ].toString() );
      _costGold = TextEditingController( text: widget.data[ 'cost_gold' ].toString() );      
      _costPoints = TextEditingController( text: widget.data[ 'cost_points' ].toString() );
      _upkeepFood = TextEditingController( text: widget.data[ 'upkeep_food' ].toString() );
      _upkeepGold = TextEditingController( text: widget.data[ 'upkeep_gold' ].toString() );
      _position = TextEditingController( text: widget.data[ 'display_position' ].toString() );
      _available = widget.data[ 'available' ] == 1;
      _ranged = widget.data[ 'ranged' ] == 1;
      _recruitable = widget.data[ 'recruitable' ] == 1;
    }
  }

  @override
  Widget build(BuildContext context) {
    print( widget.data );

    _context = context;

    return Container(
      color: Colors.blue[100],
      child: Column(
        mainAxisSize: MainAxisSize.min,        
        children: [
          Container(
            color: Colors.blue[ 400 ],
            padding: EdgeInsets.all( 20 ),
            child: Text( 
              ( widget.data != null ? 'Edit' : 'Add' ) + ' Unit',
              style: PRStyles.ModalHeaderText
            ),
            width: 661,
          ),
          Padding(
            padding: EdgeInsets.all( 20 ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Row(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children:[
                    SizedBox(
                      width: 300,
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          getTextField( context, _name, _nameField, 'Name', _pluralField),                          
                          SizedBox( height: 10 ),
                          getTextField( context, _plural, _pluralField, 'Plural', _attackField ),
                          SizedBox( height: 10 ),
                          Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              getTextField( context, _attack, _attackField, 'Attack', _defenseField, expanded: true ),
                              SizedBox( width: 10 ),
                              getTextField( context, _defense, _defenseField, 'Defense', _healthField, expanded: true ),
                              SizedBox( width: 10 ),
                              getTextField( context, _health, _healthField, 'Health', _positionField, expanded: true ),
                            ],
                          ),
                          SizedBox( height: 5 ),
                          Row(
                            children:[
                              Text( 'Available: ' ),
                              Switch(
                                onChanged: (bool value) { 
                                  setState( () {
                                    _available = value;
                                  } );
                                }, 
                                value: _available,
                              ),
                              getTextField( context, _position, _positionField, 'Position', _costGoldField, expanded: true ),
                            ],
                          ),
                          SizedBox( height: 5 ),
                          Row(
                            children:[
                              Text( 'Recruitable: ' ),
                              Switch(
                                onChanged: (bool value) { 
                                  setState( () {
                                    _recruitable = value;
                                  } );
                                }, 
                                value: _recruitable,
                              ),
                              Text( 'Ranged: ' ),
                              Switch(
                                onChanged: (bool value) { 
                                  setState( () {
                                    _ranged = value;
                                  } );
                                }, 
                                value: _ranged,
                              ),
                            ],
                          ),
                          SizedBox( height: 5 ),                          
                        ]
                      ),
                    ),
                    SizedBox( width: 15 ),                
                    GestureDetector(
                      onTap: () async {
                        pickFile();
                      },
                      child: getImage(),
                    ),
                  ],
                ),
                SizedBox( 
                  width: 620,
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      getTextField( context, _costGold, _costGoldField, 'Gold Cost', _costPointsField, expanded: true ),
                      SizedBox( width: 10 ),
                      getTextField( context, _costPoints, _costPointsField, 'Point Cost', _upkeepGoldField, expanded: true ),
                      SizedBox( width: 10 ),
                      getTextField( context, _upkeepGold, _upkeepGoldField, 'Gold Upkeep', _upkeepFoodField, expanded: true ),
                      SizedBox( width: 10 ),
                      getTextField( context, _upkeepFood, _upkeepFoodField, 'Food Upkeep', null, expanded: true ),
                    ],
                  ),
                ),
                SizedBox( height: 10 ),
                SizedBox( 
                  width: 500,
                  child: Row(
                    mainAxisSize: MainAxisSize.max,
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children:[
                      RaisedButton(
                        color: Colors.blue,
                        onPressed: () async { 
                          await onSave();
                          Navigator.of( context ).pop( true );
                        },
                        child: Text( 'SAVE', style:PRStyles.ButtonText ),
                      ),
                      RaisedButton(
                        color: Colors.red,
                        onPressed: () async {                     
                          if( widget.data != null ) {
                            bool result = await showDialog(
                              context:context,
                              barrierDismissible:false,
                              builder: ( context ) {
                                return AlertDialog(
                                  title: Text( 'DELETE UNIT?' ),
                                  actions: [
                                    RaisedButton( 
                                      onPressed: () { 
                                        Navigator.of( context ).pop( false );
                                      },
                                      child: Text( 'CANCEL' ),
                                    ),
                                    RaisedButton(
                                      color: Colors.red,
                                      onPressed: () { 
                                        Navigator.of( context ).pop( true );
                                      },
                                      child: Text( 'DELETE' ),
                                    )
                                  ],
                                );
                              }
                            );

                            if( result ) {
                              await onDelete();
                              Navigator.of( context ).pop( true );
                            }                            
                          } else closeDialog();                          

                          return true;
                        },
                        child: Text( 
                          widget.data != null ? 'DELETE' : 'CANCEL', 
                          style:PRStyles.ButtonText 
                        ),
                      ),
                    ]
                  ),
                ),
              ]
            ),
          )
        ]
      )
    );
  }
}

