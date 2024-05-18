Плагин нужно писать на том же языке на котором написан janus-gateway: C
Есть возможность писать и на других языках например С++ но это сложнее я не копал как именно  

Структура плагина


Структура janus_plugin: https://janus.conf.meetecho.com/docs/structjanus__plugin.html
Документация plugin.h: https://janus.conf.meetecho.com/docs/plugin_8h.html




Разбор примера плагина janus_helloworld_plugin.c

Рассмотрим на примере тестового плагина janus_helloworld_plugin.c

Плагин должен подключить следующие заголовки:

```plugin.h``` - Основной заголовок который отвечает за основные методы для инициализации плагина.

```jansson.h``` - Заголовок из библиотеки C Janson для кодирования, декодирования и обработки данных JSON.

```debug.h``` - Методы для логирования в janus, это их собственные JANUS_LOG()

```C

#include <jansson.h>
#include <plugins/plugin.h>
#include <debug.h>

```

Это позволит использовать основные методы которые нужны для работы плагина

У плагина должны быть константы которые будут использоваться для информации о плагине 


```C
#define JANUS_HELLOWORLD_PLUGIN_VERSION 1
#define JANUS_HELLOWORLD_PLUGIN_VERSION_STRING	"0.0.1"
#define JANUS_HELLOWORLD_PLUGIN_DESCRIPTION "The simplest possible Janus plugin."
#define JANUS_HELLOWORLD_PLUGIN_NAME "JANUS hello world plugin"
#define JANUS_HELLOWORLD_PLUGIN_AUTHOR	"{Author's name}"
#define JANUS_HELLOWORLD_PLUGIN_PACKAGE "janus.plugin.helloworld_plugin"
```



Создаем список имен методов которые будем маппить к дефолтным методам janus_plugin


```C
janus_plugin *create(void);
int janus_helloworld_plugin_init(janus_callbacks *callback, const char *config_path);
void janus_helloworld_plugin_destroy(void);
int janus_helloworld_plugin_get_api_compatibility(void);
int janus_helloworld_plugin_get_version(void);
const char *janus_helloworld_plugin_get_version_string(void);
const char *janus_helloworld_plugin_get_description(void);
const char *janus_helloworld_plugin_get_name(void);
const char *janus_helloworld_plugin_get_author(void);
const char *janus_helloworld_plugin_get_package(void);
void janus_helloworld_plugin_create_session(janus_plugin_session *handle, int *error);
struct janus_plugin_result *janus_helloworld_plugin_handle_message(janus_plugin_session *handle, char *transaction, json_t *message, json_t *jsep);
void janus_helloworld_plugin_setup_media(janus_plugin_session *handle);
void janus_helloworld_plugin_incoming_rtp(janus_plugin_session *handle, int video, char *buf, int len);
void janus_helloworld_plugin_incoming_rtcp(janus_plugin_session *handle, int video, char *buf, int len);
void janus_helloworld_plugin_incoming_data(janus_plugin_session *handle, char *buf, int len);
void janus_helloworld_plugin_slow_link(janus_plugin_session *handle, int uplink, int video);
void janus_helloworld_plugin_hangup_media(janus_plugin_session *handle);
void janus_helloworld_plugin_destroy_session(janus_plugin_session *handle, int *error);
json_t *janus_helloworld_plugin_query_session(janus_plugin_session *handle);
```

Инициируем маппинг наших методов со стандартными методами которые предоставляет api plugin.h



```C
static janus_plugin janus_helloworld_plugin =
  JANUS_PLUGIN_INIT(.init = janus_helloworld_plugin_init,
                    .destroy = janus_helloworld_plugin_destroy,
                    .get_api_compatibility = janus_helloworld_plugin_get_api_compatibility,
                    .get_version = janus_helloworld_plugin_get_version,
                    .get_version_string = janus_helloworld_plugin_get_version_string,
                    .get_description = janus_helloworld_plugin_get_description,
                    .get_name = janus_helloworld_plugin_get_name,
                    .get_author = janus_helloworld_plugin_get_author,
                    .get_package = janus_helloworld_plugin_get_package,
                    .create_session = janus_helloworld_plugin_create_session,
                    .handle_message = janus_helloworld_plugin_handle_message,
                    .setup_media = janus_helloworld_plugin_setup_media,
                    .incoming_rtp = janus_helloworld_plugin_incoming_rtp,
                    .incoming_rtcp = janus_helloworld_plugin_incoming_rtcp,
                    .incoming_data = janus_helloworld_plugin_incoming_data,
                    .slow_link = janus_helloworld_plugin_slow_link,
                    .hangup_media = janus_helloworld_plugin_hangup_media,
                    .destroy_session = janus_helloworld_plugin_destroy_session,
                    .query_session = janus_helloworld_plugin_query_session,
                    );


```

Создаем сами методы в которых будет выполняемая логика


```C
janus_plugin *create(void) {
  JANUS_LOG(LOG_VERB, "%s created!\n", JANUS_HELLOWORLD_PLUGIN_NAME);
  return &janus_helloworld_plugin;
}

int janus_helloworld_plugin_init(janus_callbacks *callback, const char *config_path) {
  JANUS_LOG(LOG_INFO, "%s initialized!\n", JANUS_HELLOWORLD_PLUGIN_NAME);
  return 0;
}

void janus_helloworld_plugin_destroy(void) {
  JANUS_LOG(LOG_INFO, "%s destroyed!\n", JANUS_HELLOWORLD_PLUGIN_NAME);
}

int janus_helloworld_plugin_get_api_compatibility(void) {
  return JANUS_PLUGIN_API_VERSION;
}

int janus_helloworld_plugin_get_version(void) {
  return JANUS_HELLOWORLD_PLUGIN_VERSION;
}

const char *janus_helloworld_plugin_get_version_string(void) {
  return JANUS_HELLOWORLD_PLUGIN_VERSION_STRING;
}

const char *janus_helloworld_plugin_get_description(void) {
  return JANUS_HELLOWORLD_PLUGIN_DESCRIPTION;
}

const char *janus_helloworld_plugin_get_name(void) {
  return JANUS_HELLOWORLD_PLUGIN_NAME;
}

const char *janus_helloworld_plugin_get_author(void) {
  return JANUS_HELLOWORLD_PLUGIN_AUTHOR;
}

const char *janus_helloworld_plugin_get_package(void) {
  return JANUS_HELLOWORLD_PLUGIN_PACKAGE;
}

void janus_helloworld_plugin_create_session(janus_plugin_session *handle, int *error) {
  JANUS_LOG(LOG_INFO, "Session created.\n");
}

void janus_helloworld_plugin_destroy_session(janus_plugin_session *handle, int *error) {
  janus_refcount_decrease(&handle->ref);
  JANUS_LOG(LOG_INFO, "Session destroyed.\n");
}

json_t *janus_helloworld_plugin_query_session(janus_plugin_session *handle) {
  return json_object();
}

struct janus_plugin_result *janus_helloworld_plugin_handle_message(janus_plugin_session *handle, char *transaction, json_t *message, json_t *jsep) {
  return janus_plugin_result_new(JANUS_PLUGIN_OK, NULL, json_object());
}

void janus_helloworld_plugin_setup_media(janus_plugin_session *handle) {
  JANUS_LOG(LOG_INFO, "WebRTC media is now available.\n");
}

void janus_helloworld_plugin_incoming_rtp(janus_plugin_session *handle, int video, char *buf, int len) {
  JANUS_LOG(LOG_VERB, "Got an RTP message (%d bytes.)\n", len);
}

void janus_helloworld_plugin_incoming_rtcp(janus_plugin_session *handle, int video, char *buf, int len) {
  JANUS_LOG(LOG_VERB, "Got an RTCP message (%d bytes.)\n", len);
}

void janus_helloworld_plugin_incoming_data(janus_plugin_session *handle, char *buf, int len) {
  JANUS_LOG(LOG_VERB, "Got a DataChannel message (%d bytes.)\n", len);
}

void janus_helloworld_plugin_slow_link(janus_plugin_session *handle, int uplink, int video) {
  JANUS_LOG(LOG_VERB, "Slow link detected.\n");
}

void janus_helloworld_plugin_hangup_media(janus_plugin_session *handle) {
  JANUS_LOG(LOG_INFO, "No WebRTC media anymore.\n");
}
```

Это весь код который нужен что-бы протестировать работу нашего плагина, далее можно переходить к сборке плагина



Сборка плагина в Docker

Для сборки плагина лучше всего использовать докер и не пытаться локально устанавливать нужные зависимости т.к. это будет долго и чревато ошибками связанных с окружением особенно с Windows
Но все же можно и локально, но советую использовать Docker т.к. первым делом нам нужен собранный janus-gateway в котором уже будут нужные библиотеки для сборки плагина 


Создаем папку в самой верхней директории контейнера, например janus-plugin-hello-world
Добавляем в созданную папку следующие файлы с содержимым

bootstrap

```sh
#!/bin/sh
autoreconf --verbose --force --install || exit 1
```

configure.ac

```C
AC_INIT([janus-helloworld], [1.0], [marshall@quander.me])
AM_INIT_AUTOMAKE([foreign subdir-objects])
AC_ENABLE_SHARED(yes)
AC_CONFIG_MACRO_DIR([m4]) # Если появляется ошибка с обнаружением директории m4 то можно закомментировать эту строку и вручную создать папку
AC_DISABLE_STATIC(yes)

LT_INIT
AC_PROG_CC

AC_CONFIG_FILES([Makefile plugin/Makefile]) # через / указать Makefile и папку где плагин
AC_OUTPUT
```

Makefile.am


```
ACLOCAL_AMFLAGS = -I m4
SUBDIRS = plgugin # Тут через пробел указываем папки где будут плагины
```


Создаем папку plugin внутри которой будет файл с кодом плагина и Makefile.am, папку можно назвать как угодно главное чтобы название чтобы было актуальное в Makefile.am и configure.ac


```C
JANUS_PATH=$(exec_prefix)
CFLAGS = $(shell pkg-config --cflags glib-2.0) -I$(JANUS_PATH)/include/janus
LIBS = $(shell pkg-config --libs glib-2.0)
# эту часть не менять

lib_LTLIBRARIES = libjanus_helloworld_plugin.la
libjanus_helloworld_plugin_la_SOURCES = janus_helloworld_plugin.c
libjanus_helloworld_plugin_la_LDFLAGS = -version-info 0:0:0 $(shell pkg-config --libs glib-2.0) -L$(JANUS_PATH)/lib
libdir = $(exec_prefix)/lib/janus/plugins # тут заменить везде helloworld на название плагина, остальное не менять
```


Команды для сборки плагина



Все команды выполняются из директории созданной папки janus-plugin-hello-world

```--prefix=``` - тут указывается директория где собран наш janus, если сборка из докер файла инфры то там директория 
```/var/janus/janus/```, в другом случае поменять


```
./bootstrap
./configure --prefix=/var/janus/janus/
make
make install 
```

После выполнения убедиться что нет ошибок при выполнении сборки, если все хорошо то в директории плагинов собранного janus /var/janus/janus/lib/janus/plugins появятся файлы нашего плагина 

```
libjanus_helloworld_plugin.la
libjanus_helloworld_plugin.so
libjanus_helloworld_plugin.so.0
libjanus_helloworld_plugin.so.0.0.0
```

Все что остается это только перезапустить janus и при инициализации среди логов должно появиться

```
Loading plugin 'libjanus_helloworld_plugin.so'...
JANUS hello world plugin initialized!
```
