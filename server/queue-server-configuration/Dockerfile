FROM --platform=linux/amd64 python:3.12

WORKDIR /code

COPY . /code


# Install EPICS
RUN apt-get update --allow-unauthenticated && apt-get install -y --allow-unauthenticated debian-archive-keyring
RUN apt-get update
RUN apt-get install -y build-essential libreadline-dev wget git
WORKDIR /opt
RUN git clone https://github.com/epics-base/epics-base.git 
WORKDIR /opt/epics-base
RUN git checkout R7.0.7
RUN make

ENV EPICS_BASE="/opt/epics-base"
#ENV EPICS_HOST_ARCH=$(${EPICS_BASE}/startup/EpicsHostArch)
#ENV PATH=${EPICS_BASE}/bin/${EPICS_HOST_ARCH}:${PATH}
# Use a RUN command to evaluate and set EPICS_HOST_ARCH
RUN EPICS_HOST_ARCH=$(${EPICS_BASE}/startup/EpicsHostArch) && \
    echo "export EPICS_HOST_ARCH=${EPICS_HOST_ARCH}" >> /etc/bash.bashrc

# Determine EPICS_HOST_ARCH and add it to the PATH, then append it to bash.bashrc
RUN EPICS_HOST_ARCH=$(${EPICS_BASE}/startup/EpicsHostArch) && \
    echo "export EPICS_HOST_ARCH=${EPICS_HOST_ARCH}" >> /etc/bash.bashrc && \
    echo "export PATH=${EPICS_BASE}/bin/${EPICS_HOST_ARCH}:\$PATH" >> /etc/bash.bashrc



# Install required Python packages
RUN pip install bluesky-queueserver

# Install curl to download Miniconda
RUN apt-get update && apt-get install -y curl

# Download and install Miniconda
RUN curl -LO https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh && \
    bash Miniconda3-latest-Linux-x86_64.sh -b -p /opt/miniconda && \
    rm Miniconda3-latest-Linux-x86_64.sh

# Add Miniconda to the PATH
ENV PATH="/opt/miniconda/bin:$PATH"

# Verify Conda is installed
RUN conda --version

# With Conda installed, install pyepics
RUN conda install -c conda-forge epics-base pyepics ophyd