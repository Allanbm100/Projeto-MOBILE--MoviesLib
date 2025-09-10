import React,{ useState, useLayoutEffect } from 'react'
import { View, StyleSheet, Text, ScrollView, TextInput, TouchableOpacity, Alert } from "react-native"
import { s, vs } from "react-native-size-matters"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
{/** s = scale, vs = verticalScale */}
import { useRoute, useNavigation } from "@react-navigation/native"
import { addMovie, updateMovie } from '../services/movieService'

export default function MovieFormScreen() {

    const [title, setTitle] = useState<string>('');
    const [rating, setRating] = useState<string>('');
    const [duration, setDuration] = useState<string>('');
    const [categories, setCategories] = useState<string>('');
    const [poster, setPoster] = useState<string>('');
    const [synopsis, setSynopsis] = useState<string>('');

    const route = useRoute();
    const navigation = useNavigation<any>();

    const movie = (route.params as any)?.movie ?? null;
    const onSave = route.params?.onSave;

    function isValidUrl(text: string): boolean {
        try {
            const url = new URL(text)
            return url.protocol === "http:" || url.protocol === "https:"
        } catch {
            return false
        }
    }

    const handleSave = async () => {
        if (title.length == 0) {
            Alert.alert("Atenção", "Digite o título do filme")
            return
        }
        const parsedRating = parseFloat(rating.replace(',', '.'));
        if (Number.isNaN(parsedRating)) {
            Alert.alert("Atenção", "Informa um valor numérico para a nota (ex.: 8.5)")
            return
        }
        if (duration.length == 0) {
            Alert.alert("Atenção", "Digite a duração do filme")
            return
        }
        if (categories.length == 0) {
            Alert.alert("Atenção", "Digite as categorias do filme")
            return
        }
        if (isValidUrl(poster) == false) {
            Alert.alert("Atenção", "URL do pôster do filme inválida")
            return
        }
        if (synopsis.length == 0) {
            Alert.alert("Atenção", "Digite a sinopse do filme")
            return
        }
        const movieData = {
            title,
            rating: parsedRating,
            duration,
            categories,
            poster,
            synopsis,
        }
        try {
            let savedMovie
            if (movie) {
                savedMovie = await updateMovie(movie.id, movieData)
            } else {
                savedMovie = await addMovie(movieData)
            }
            if (onSave) {
                onSave(savedMovie)
            }
            navigation.goBack()
        } catch(error) {
            console.log(error)
            Alert.alert('Atenção', "Não foi possível salvar o filme. Tente novamente mais tarde!")
        }
    }

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
    }, [])

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <ScrollView style={{ padding: 20}}>
                    <Text style={styles.sectionTitle}>TÍTULO</Text>
                    <TextInput 
                        style={styles.input} 
                        value={title} 
                        onChangeText={setTitle} 
                        placeholder='Escreva o nome do filme' 
                    />

                    <Text style={styles.sectionTitle}>NOTA E DURAÇÃO</Text>
                    <View style={{ flexDirection: 'row', flex: 1, gap: 10 }}>
                        <TextInput 
                            style={styles.input} 
                            value={rating} 
                            onChangeText={setRating} 
                            placeholder='Nota' 
                        />
                        <TextInput 
                            style={styles.input} 
                            value={duration} 
                            onChangeText={setDuration} 
                            placeholder='Duração' 
                        />
                    </View>

                    <Text style={styles.sectionTitle}>CATEGORIAS</Text>
                    <TextInput 
                        style={styles.input} 
                        value={categories} 
                        onChangeText={setCategories} 
                        placeholder='Insira as principais categorias' 
                    />

                    <Text style={styles.sectionTitle}>PÔSTER</Text>
                    <TextInput 
                        style={styles.input} 
                        value={poster} 
                        onChangeText={setPoster} 
                        placeholder='Insira a URL do poster' 
                    />

                    <Text style={styles.sectionTitle}>SINOPSE</Text>
                    <TextInput 
                        style={[styles.input, {height: vs(120)}]} 
                        value={synopsis} 
                        onChangeText={setSynopsis} 
                        multiline
                        textAlignVertical='top'
                        placeholder='Sinopse do filme' 
                    />
                </ScrollView>
                <View style={styles.buttonArea}>
                    <TouchableOpacity onPress={() => {}} style={styles.button}>
                        <Text style={{ color: 'white', fontSize: s(18) }}>
                            { movie == null ? "Cadastrar filme" : "Salvar alterações" }
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F2F2F7",
    },
    sectionTitle: {
        fontSize: s(12),
        color: "#8D8D8D",
    },
    input: {
        flex: 1,
        height: vs(42),
        backgroundColor: "white",
        borderRadius: s(8),
        paddingHorizontal: 10,
        marginTop: 10,
        marginBottom: 20,
    },
    buttonArea: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: "white",
        height: 86,
    },
    button: {
        flex: 1,
        backgroundColor: "#EB4435",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
    }
})