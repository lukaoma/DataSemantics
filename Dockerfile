FROM nikolaik/python-nodejs

#COPY . /app



RUN ls && pwd

RUN git clone https://github.com/lukaoma/DataSemantics.git
RUN ls && pwd

WORKDIR /DataSemantics

RUN ls && pwd
RUN cd react-ui && yarn install && yarn build
RUN pwd && ls
RUN pip3 install -r requirements.txt

EXPOSE 5000

ENTRYPOINT [ "python" ]

CMD [ "main.py" ]
