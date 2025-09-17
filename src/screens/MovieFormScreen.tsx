import { useTranslation } from "react-i18next";

import React,{ useState, useLayoutEffect } from 'react'
import { View, StyleSheet, Text, ScrollView, TextInput, TouchableOpacity, Alert } from "react-native"
import { s, vs } from "react-native-size-matters"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
{/** s = scale, vs = verticalScale */}
import { useRoute, useNavigation } from "@react-navigation/native"
import { addMovie, updateMovie } from '../services/movieService'
import { APP_COLORS } from '../colors/Colors'
import { AppContext } from '../../App'

export default function MovieFormScreen() {
    
    const [title, setTitle] = useState<string>('');
    const [rating, setRating] = useState<string>('');
    const [duration, setDuration] = useState<string>('');
    const [categories, setCategories] = useState<string>('');
    const [poster, setPoster] = useState<string>('');
    const [synopsis, setSynopsis] = useState<string>('');
    const { t } = useTranslation()

    const route = useRoute();
    const navigation = useNavigation<any>();
    const { value } = React.useContext(AppContext);

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
            Alert.alert(t("attention"), t("emptyTitleMessage"))
            return
        }
        const parsedRating = parseFloat(rating.replace(',', '.'));
        if (Number.isNaN(parsedRating)) {
            Alert.alert(t("attention"), t("numericRateMessage"))
            return
        }
        if (duration.length == 0) {
            Alert.alert(t("attention"), t("movieDurationMessage"))
            return
        }
        if (categories.length == 0) {
            Alert.alert(t("attention"), t("categoriesMessage"))
            return
        }
        if (isValidUrl(poster) == false) {
            Alert.alert(t("attention"), t("invalidURLMessage"))
            return
        }
        if (synopsis.length == 0) {
            Alert.alert(t("attention"), t("movieSynopsisMessage"))
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
            Alert.alert(t("attention"), t("tryAgainLater"))
        }
    }

    useLayoutEffect(() => {
        navigation.setOptions({ title: movie == null ? t("registration") : t("editing") });
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
                    <Text style={styles.sectionTitle}>{t("title").toUpperCase()}</Text>
                    <TextInput 
                        style={styles.input} 
                        value={title} 
                        onChangeText={setTitle} 
                        placeholder={t("titlePlaceholder")} 
                    />

                    <Text style={styles.sectionTitle}>{t("rateAndDuration").toUpperCase()}</Text>
                    <View style={{ flexDirection: 'row', flex: 1, gap: 10 }}>
                        <TextInput 
                            style={styles.input} 
                            value={rating} 
                            onChangeText={setRating} 
                            placeholder={t("rate")} 
                        />
                        <TextInput 
                            style={styles.input} 
                            value={duration} 
                            onChangeText={setDuration} 
                            placeholder={t("duration")} 
                        />
                    </View>

                    <Text style={styles.sectionTitle}>{t("duration").toUpperCase()}</Text>
                    <TextInput 
                        style={styles.input} 
                        value={categories} 
                        onChangeText={setCategories} 
                        placeholder={t("categoriesPlaceholder")}
                    />

                    <Text style={styles.sectionTitle}>{t("poster").toUpperCase()}</Text>
                    <TextInput 
                        style={styles.input} 
                        value={poster} 
                        onChangeText={setPoster} 
                        placeholder={t("posterPlaceholder")}
                    />

                    <Text style={styles.sectionTitle}>{t("synopsis").toUpperCase()}</Text>
                    <TextInput 
                        style={[styles.input, {height: vs(120)}]} 
                        value={synopsis} 
                        onChangeText={setSynopsis} 
                        multiline
                        textAlignVertical='top'
                        placeholder={t("synopsisPlaceholder")} 
                    />
                </ScrollView>
                <View style={styles.buttonArea}>
                    <TouchableOpacity onPress={() => {}} style={[styles.button, { backgroundColor: APP_COLORS[Number(value)] }]}>
                        <Text style={{ color: 'white', fontSize: s(18) }}>
                            { movie == null ? t("registerMovie") : t("saveChanges") }
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
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
    }
})