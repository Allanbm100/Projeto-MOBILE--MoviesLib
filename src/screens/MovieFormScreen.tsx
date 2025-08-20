import React,{ useState, useLayoutEffect } from 'react'
import { View, StyleSheet, Text, ScrollView, TextInput, TouchableOpacity } from "react-native"
import { s, vs } from "react-native-size-matters"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
{/** s = scale, vs = verticalScale */}
import { useRoute, useNavigation } from "@react-navigation/native"

export default function MovieFormScreen() {

    const [title, setTitle] = useState<string>('');
    const [rating, setRating] = useState<string>('');
    const [duration, setDuration] = useState<string>('');
    const [categories, setCategories] = useState<string>('');
    const [poster, setPoster] = useState<string>('');
    const [synopsis, setSynopsis] = useState<string>('');

    const route = useRoute();
    const navigation = useNavigation<any>();

    const movie = (route.params as any)?.movies ?? null;

    useLayoutEffect(() => {
        navigation.setOptions({ title: movie == null ? "Cadastro" : "Edição" });
        if (movie) {
            setTitle(movie.title || "");
            setRating(movie.rating.toString() || "");
            setDuration(movie.duration || "");
            setCategories(movie.categories || "");
            setPoster(movie.poster || "");
            setSynopsis(movie.synopsis || "");
        }
    })

    return (
        <View style={styles.container}>
            <Text>MovieFormScreen</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})