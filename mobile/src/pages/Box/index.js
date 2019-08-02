import React, { Component } from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import styles from './styles';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../../services/api';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { distanceInWords } from 'date-fns';
import pt from 'date-fns/locale/pt';
import ImagePicker from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import socket from 'socket.io-client';

export default class Box extends Component {

  state = {
    box: {}
  };

  subscribeToNewFiles = (box) =>{
    //faz conexão com o socket iniciado no backend 
    const io = socket('https://backend-omnistack-semana6.herokuapp.com');
    io.emit('connectRoom', box);
    io.on('file', data=>{
      this.setState({box: {...this.state.box, files: [data, ...this.state.box.files]}});
    })
    
}
  async componentDidMount() {    
    const box = await AsyncStorage.getItem('@RocketBox:box');
    this.subscribeToNewFiles(box);
    const response = await api.get(`boxes/${box}`);
    this.setState({ box: response.data });
  }

  openFile = async (file) =>{
    const filePath = `${RNFS.DocumentDirectoryPath}/${file.title}`;
    console.log(filePath);
    try{
      //baixa imagem 
      await RNFS.downloadFile({
        fromUrl: file.url,
        toFile: filePath,
      })
      // abre a imagem 
      await FileViewer.open(filePath);
    }catch(err){
      console.log('Arquivo não suportado! ');
    }
  }
  renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => {this.openFile(item) }}
      style={styles.file}>
      <View style={styles.fileInfo}>
        <Icon name="insert-drive-file" size={24} color="#a5cfff" />
        <Text style={styles.fileTitle}>{item.title}</Text>
        <Text style={styles.fileDate}>
          {" "}há{" "}
          {distanceInWords(item.createdAt, new Date(), {
            locale: pt
          })}
        </Text>
      </View>
    </TouchableOpacity>
  );

  handleUpload =() =>{
    ImagePicker.launchImageLibrary({}, async upload =>{
      if(upload.error){
         console.log('ImagePicker error');
      }
      else if(upload.didCancel){
        console.log('Canceled by user');
      }
      else {
        const data = new FormData();
        //definido pois ios tem tipo de arquivo de extensão nao convencional .heic
        const [prefix, suffix] = upload.fileName.split('.');
        const ext = suffix.toLowerCase() === "heic"?"jpg":suffix;

        data.append('file',{
          uri: upload.uri,
          type: upload.type,
          name: `${prefix}.${ext}`
        });
        api.post(`boxes/${this.state.box._id}/files`,data);
      }
    });
  }
  render() {
    return (

      <View style={styles.container}>
        <Text style={styles.boxTitle}>{this.state.box.title}</Text>

        <FlatList
          style={styles.list}
          data={this.state.box.files}
          keyExtractor={file => file._id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={this.renderItem}
        />
        <TouchableOpacity style={styles.fab} onPress={this.handleUpload }>
          <Icon name="cloud-upload" size={24} color="#fff"/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonVoltar} onPress={()=>{
          this.props.navigation.navigate('Main')}
           }>
          <Icon name="chevron-left" size={24} color="#fff"/>
        </TouchableOpacity>
      </View>);
  }
}
