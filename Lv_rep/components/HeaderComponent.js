import { View,Text,StyleSheet } from "react-native"

export const HeaderComponent = ()=>{
    return (
        <View>
            <Text style={styles.title}>LOUIS VUITTON</Text>
            <View style={styles.line}/>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        textTransform: 'uppercase',
      },
      line: {
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        marginTop: 10,
        marginHorizontal: 20,
      },
})