# Fuentes en Piru App

## Configuración de Fuentes Cinzel

Este proyecto está configurado para usar la fuente **Cinzel** de Google Fonts con React Native + Expo + NativeWind.

### Fuentes Disponibles

- `font-cinzel` - Cinzel Regular (400)
- `font-cinzel-bold` - Cinzel Bold (700)  
- `font-cinzel-black` - Cinzel Black (900)

### Cómo Usar

#### 1. Con el componente T (Recomendado)
```tsx
import { T } from '@/components/ui/T';

// Usa Cinzel Regular por defecto
<T className="text-2xl text-white">Texto con Cinzel</T>

// Usa Cinzel Bold
<T className="text-xl font-cinzel-bold text-white">Texto en negrita</T>

// Usa Cinzel Black
<T className="text-lg font-cinzel-black text-white">Texto muy grueso</T>
```

#### 2. Con Text directamente
```tsx
import { Text } from 'react-native';

<Text className="font-cinzel text-white">Texto con Cinzel</Text>
<Text className="font-cinzel-bold text-white">Texto en negrita</Text>
<Text className="font-cinzel-black text-white">Texto muy grueso</Text>
```

### Archivos Configurados

- ✅ `tailwind.config.js` - Configuración de familias de fuentes
- ✅ `app/_layout.tsx` - Carga de fuentes con `useFonts`
- ✅ `components/ui/T.tsx` - Componente de texto temático
- ✅ `package.json` - Dependencia `@expo-google-fonts/cinzel` instalada

### Ejemplo de Uso en Quiz

En `app/quiz.tsx` se aplicó la fuente Cinzel a:
- Títulos principales (`font-cinzel-bold`)
- Placa de progreso (`font-cinzel-black`)
- Preguntas del quiz (`font-cinzel-bold`)

### Notas Importantes

1. **Carga de fuentes**: Las fuentes se cargan en `_layout.tsx` y la app espera a que estén listas
2. **Variantes**: En React Native, cada peso es una familia separada, no uses `fontWeight`
3. **Cache**: Si no ves cambios, limpia el cache: `npx expo start -c`
4. **Consistencia**: Usa el componente `T` para mantener consistencia en toda la app

### Troubleshooting

- **Fuentes no cargan**: Verifica que `@expo-google-fonts/cinzel` esté en `package.json`
- **Clases no aplican**: Asegúrate de que el `content` en `tailwind.config.js` incluya tus archivos
- **Metro cache**: Ejecuta `npx expo start -c` para limpiar cache
