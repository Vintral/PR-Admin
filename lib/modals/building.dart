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

class BuildingModal extends StatefulWidget {
  final dynamic data;

  BuildingModal( { this.data } );
  
  @override
  State<StatefulWidget> createState() => _BuildingModalState();
}

class _BuildingModalState extends State<BuildingModal> {
  final ImagePicker _picker = ImagePicker();
  Uint8List uploadedImage;

  BuildContext _context;

  TextEditingController _name = TextEditingController();
  TextEditingController _plural = TextEditingController();
  TextEditingController _costWood = TextEditingController();
  TextEditingController _costStone = TextEditingController();
  TextEditingController _costPoints = TextEditingController();
  TextEditingController _field = TextEditingController();
  TextEditingController _bonus = TextEditingController();
  TextEditingController _position = TextEditingController();
  FocusNode _nameField = FocusNode();
  FocusNode _pluralField = FocusNode();
  FocusNode _costWoodField = FocusNode();
  FocusNode _costStoneField = FocusNode();
  FocusNode _costPointsField = FocusNode();
  FocusNode _fieldField = FocusNode();
  FocusNode _bonusField = FocusNode();
  FocusNode _positionField = FocusNode();

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
          ? Config.ImageURL + 'buildings/' + widget.data[ 'type' ] + '.png?' + Random().nextDouble().toString() 
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
    ret[ 'cost_wood' ] = _costWood.text;
    ret[ 'cost_stone' ] = _costStone.text;
    ret[ 'cost_points' ] = _costPoints.text;
    ret[ 'available' ] = _available;
    ret[ 'field' ] = _field.text;
    ret[ 'bonus' ] = _bonus.text;
    ret[ 'display_position' ] = _position.text;
    
    return ret;
  }

  Future<http.Response> onSave() async {
    return http.post( 
      Config.URL + 'buildings' + ( widget.data == null ? '/add' : '' ),
      headers: <String,String> {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode( getPayload() )
    );
  }

  Future<http.Response> onDelete() async {
    return http.post( 
      Config.URL + 'buildings/delete',
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

  @override
  void initState() {    
    super.initState();

    print( widget.data );
    if( widget.data != null ) {      
      _name = TextEditingController( text: widget.data[ 'name' ] );
      _plural = TextEditingController( text: widget.data[ 'plural' ].toString() );
      _costWood = TextEditingController( text: widget.data[ 'cost_wood' ].toString() );
      _costStone = TextEditingController( text: widget.data[ 'cost_stone' ].toString() );
      _costPoints = TextEditingController( text: widget.data[ 'cost_points' ].toString() );
      _field = TextEditingController( text: widget.data[ 'field' ].toString() );
      _bonus = TextEditingController( text: widget.data[ 'bonus' ].toString() );
      _position = TextEditingController( text: widget.data[ 'display_position' ].toString() );
      _available = widget.data[ 'available' ] == 1;
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
              widget.data != null ? 'Edit Building' : 'Add Building',
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
                          TextField(
                            controller: _name,
                            focusNode: _nameField,
                            decoration: InputDecoration(
                              labelText: 'Name',
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular( 5 ),
                                borderSide: BorderSide(
                                  color: Colors.blue,
                                  width: 1,
                                )
                              )
                            ),
                            onSubmitted: (_) {                        
                              _nameField.unfocus();
                              FocusScope.of( context ).requestFocus( _pluralField );
                            },
                          ),
                          SizedBox( height: 10 ),
                          TextField(
                            controller: _plural,
                            focusNode: _pluralField,
                            decoration: InputDecoration(
                              labelText: 'Plural',
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular( 5 ),
                                borderSide: BorderSide(
                                  color: Colors.blue,
                                  width: 1,
                                )
                              )
                            ),
                            onSubmitted: (_) {                        
                              _pluralField.unfocus();
                              FocusScope.of( context ).requestFocus( _fieldField );
                            },
                          ),
                          SizedBox( height: 10 ),
                          Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Expanded(
                                child: TextField(
                                  controller: _field,
                                  focusNode: _fieldField,
                                  decoration: InputDecoration(
                                    labelText: 'Field',
                                    border: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular( 5 ),
                                      borderSide: BorderSide(
                                        color: Colors.blue,
                                        width: 1,
                                      )
                                    )
                                  ),
                                  onSubmitted: (_) {                        
                                    _fieldField.unfocus();
                                    FocusScope.of( context ).requestFocus( _bonusField );
                                  },
                                ),
                              ),
                              SizedBox( width: 10 ),
                              Expanded(
                                child: TextField(
                                  controller: _bonus,
                                  focusNode: _bonusField,
                                  decoration: InputDecoration(
                                    labelText: 'Bonus',
                                    border: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular( 5 ),
                                      borderSide: BorderSide(
                                        color: Colors.blue,
                                        width: 1,
                                      )
                                    )
                                  ),
                                  onSubmitted: (_) {                        
                                    _bonusField.unfocus();
                                    FocusScope.of( context ).requestFocus( _positionField );
                                  },
                                ),
                              ),
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
                              Expanded(
                                child: TextField(
                                  controller: _position,
                                  focusNode: _positionField,
                                  decoration: InputDecoration(
                                    labelText: 'Position',
                                    border: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular( 5 ),
                                      borderSide: BorderSide(
                                        color: Colors.blue,
                                        width: 1,
                                      )
                                    )
                                  ),
                                  onSubmitted: (_) {                        
                                    _positionField.unfocus();
                                    FocusScope.of( context ).requestFocus( _costWoodField );
                                  },
                                )
                              ),
                            ],
                          ),
                          SizedBox( height: 5 ),
                          Row(
                            children: [
                              Expanded(
                                child: TextField(
                                  controller: _costWood,
                                  focusNode: _costWoodField,
                                  decoration: InputDecoration(
                                    labelText: 'Wood',
                                    border: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular( 5 ),
                                      borderSide: BorderSide(
                                        color: Colors.blue,
                                        width: 1,
                                      )
                                    )
                                  ),
                                  onSubmitted: (_) {                        
                                    _costWoodField.unfocus();
                                    FocusScope.of( context ).requestFocus( _costStoneField );
                                  },
                                ),
                              ),
                              SizedBox( width: 10 ),
                              Expanded(
                                child: TextField(
                                  controller: _costStone,
                                  focusNode: _costStoneField,
                                  decoration: InputDecoration(
                                    labelText: 'Stone',
                                    border: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular( 5 ),
                                      borderSide: BorderSide(
                                        color: Colors.blue,
                                        width: 1,
                                      )
                                    )
                                  ),
                                  onSubmitted: (_) {                        
                                    _costStoneField.unfocus();
                                    FocusScope.of( context ).requestFocus( _costPointsField );
                                  },
                                ),
                              ),
                              SizedBox( width: 10 ),
                              Expanded(
                                child: TextField(
                                  controller: _costPoints,
                                  focusNode: _costPointsField,
                                  decoration: InputDecoration(
                                    labelText: 'Points',
                                    border: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular( 5 ),
                                      borderSide: BorderSide(
                                        color: Colors.blue,
                                        width: 1,
                                      )
                                    )
                                  ),
                                  onSubmitted: (_) {                        
                                    _costPointsField.unfocus();
                                  },
                                ),
                              ),
                            ],
                          )
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
                                  title: Text( 'DELETE BUILDING?' ),
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

