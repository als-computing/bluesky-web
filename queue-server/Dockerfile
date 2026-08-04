# No --platform pin: everything installed here builds for arm64, and emulating
# amd64 on Apple Silicon makes the queue server noticeably slower.
FROM python:3.12

WORKDIR /code

COPY . /code

# Install queue server and pyepics which provides EPICS channel access.
#
# pyepics only bundles libca.so for x86_64. epicscorelibs supplies it on other
# architectures; it has no aarch64 wheel but builds from source in about a
# minute, which beats running the whole stack under emulation. The startup
# files call `from epics import caget, caput` directly (the Mercury detector),
# so ophyd's pure-Python caproto control layer is not a substitute.
RUN pip install epicscorelibs
RUN pip install bluesky-queueserver
RUN pip install pyepics
RUN LIB="$(python -c 'import epicscorelibs.path as p; print(p.get_lib("ca"))')" \
    && ln -sf "$LIB" "$(dirname "$LIB")/libca.so"
ENV PYEPICS_LIBCA=/usr/local/lib/python3.12/site-packages/epicscorelibs/lib/libca.so
RUN test -e "$PYEPICS_LIBCA" && python -c "import epics; print('pyepics ok')"

# The startup_bl531* files also import these, and bluesky-queueserver does not
# pull them in: databroker (temp catalog), tiled (TiledWriter target), ophyd
# (devices), numpy/scipy (mono calibration and the peak fitting in the plans),
# matplotlib (imported unconditionally by bluesky's BestEffortCallback, even
# though 00_base.py immediately calls bec.disable_plots()).
# databroker[all] rather than plain databroker: the bare install is missing
# sqlalchemy, cachetools, bson (pymongo) and bluesky-tiled-plugins, each of
# which 00_base.py hits on the way to building the temp catalog and the
# TiledWriter.
RUN pip install "databroker[all]" "tiled[client]" ophyd numpy scipy matplotlib

# Dummy keys so the simulation stack runs without a .env. 00_base.py raises if
# either is unset. The real beamline overrides both from the environment.
ENV TILED_SINGLE_USER_API_KEY=bl531simdevkey \
    CENTRAL_API_KEY=bl531simdevkey
