import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import { APP_COLORS } from '../colors/Colors'
import { AppContext } from '../../App'
import React from 'react'

type Props = {
    onPress: () => void
}

export default function PlayButton({ onPress }: Props) {
    const { value } = React.useContext(AppContext);

    return (
        <TouchableOpacity onPress={ onPress} style={styles.container}>
            <View style={styles.playButton}>
                <FontAwesome6 name="play" size={18} color={APP_COLORS[Number(value)]} />
            </View>
            <Text style={styles.text}>Trailer</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: "#E8E8E8",
        height: 42,
        borderRadius: 21,
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 2,
        alignSelf: "flex-start",
    },
    playButton: {
        backgroundColor: "white",
        width: 38,
        height: 38,
        borderRadius: 19,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 2,
        paddingLeft: 4,
    },
    text: {
        marginLeft: 8,
        marginRight: 14,
        fontSize: 16,
        fontWeight: "600",
    }
})