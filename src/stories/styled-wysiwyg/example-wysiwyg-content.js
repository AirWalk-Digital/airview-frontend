import React from "react";

export function ExampleWysiwygContent() {
  return (
    <React.Fragment>
      <h1>First level header</h1>
      <h2>Second level header</h2>
      <h3>Third level header</h3>
      <h4>Fouth level header</h4>
      <h5>Fifth level header</h5>
      <h6>Sixth level header</h6>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit iste
        repellendus reprehenderit ut at quidem nobis officiis molestias? Unde
        iusto odio quaerat dicta omnis consectetur fugit. Vero dolor fugiat
        accusamus eius. Odit quisquam repellat in deleniti neque qui rerum
        recusandae necessitatibus voluptates sequi, nisi non voluptas quasi
        assumenda veniam. Maxime voluptatibus quibusdam delectus expedita ipsum,
        veniam harum optio asperiores odio aut quaerat voluptate eius accusamus?
        Exercitationem amet vel aspernatur praesentium numquam expedita
        architecto consectetur, nemo odit eveniet recusandae nesciunt quasi
        itaque possimus quibusdam officiis placeat nostrum nihil molestias quis
        nobis sequi? Id illum neque iusto incidunt, nemo magnam excepturi
        perferendis.
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit iste
        repellendus reprehenderit ut at quidem nobis officiis molestias? Unde
        iusto odio quaerat dicta omnis consectetur fugit. Vero dolor fugiat
        accusamus eius. Odit quisquam repellat in deleniti neque qui rerum
        recusandae necessitatibus voluptates sequi, nisi non voluptas quasi
        assumenda veniam. Maxime voluptatibus quibusdam delectus expedita ipsum,
        veniam harum optio asperiores odio aut quaerat voluptate eius accusamus?
        Exercitationem amet vel aspernatur praesentium numquam expedita
        architecto consectetur, nemo odit eveniet recusandae nesciunt quasi
        itaque possimus quibusdam officiis placeat nostrum nihil molestias quis
        nobis sequi? Id illum neque iusto incidunt, nemo magnam excepturi
        perferendis.
      </p>

      <p>
        This is an <a href="/">inline</a> hyperlink
      </p>

      <p>
        You can use the mark tag to <mark>highlight</mark> text
      </p>

      <p>
        <del>This line of text is meant to be treated as deleted text.</del>
      </p>

      <p>
        <s>This line of text is meant to be treated as no longer accurate.</s>
      </p>

      <p>
        <ins>
          This line of text is meant to be treated as an addition to the
          document.
        </ins>
      </p>

      <p>
        <u>This line of text will render as underlined.</u>
      </p>

      <p>
        <small>This line of text is meant to be treated as fine print.</small>
      </p>

      <p>
        <strong>This line rendered as bold text.</strong>
      </p>

      <p>
        <em>This line rendered as italicized text.</em>
      </p>

      <ul>
        <li>In fermentum leo eu lectus mollis quis dictum mi aliquet.</li>
        <li>Morbi eu nulla lobortis, lobortis est in, fringilla felis.</li>
        <li>
          Aliquam nec felis in sapien venenatis viverra fermentum nec lectus.
        </li>
        <li>Ut non enim metus.</li>
      </ul>

      <ol>
        <li>Donec blandit a lorem id convallis.</li>
        <li>Cras gravida arcu at diam gravida gravida.</li>
        <li>Integer in volutpat libero.</li>
        <li>Donec a diam tellus.</li>
        <li>Aenean nec tortor orci.</li>
        <li>Quisque aliquam cursus urna, non bibendum massa viverra eget.</li>
        <li>Vivamus maximus ultricies pulvinar.</li>
      </ol>

      <dl>
        <dt>Lorem ipsum dolor sit.</dt>
        <dd>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia id
          praesentium debitis saepe iure nam eveniet, reprehenderit harum
          dolores nisi?
        </dd>
        <dt>Eaque commodi cum itaque!</dt>
        <dd>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magnam dolor
          eos quia assumenda nisi iusto reprehenderit unde, ex, debitis
          laboriosam error reiciendis, illo iste, id nam et maxime tenetur sunt.
        </dd>
        <dt>Doloremque aperiam, explicabo debitis.</dt>
        <dd>
          Nesciunt amet et ex vitae quis ducimus, quibusdam voluptatibus!
          Asperiores hic molestias enim officiis fugiat quidem repudiandae
          numquam porro illum aliquam id, in beatae ipsam dolores et, quasi
          necessitatibus similique.
        </dd>
        <dt>Inventore fuga, perferendis consequatur.</dt>
        <dd>
          Nesciunt consectetur minima repellendus, molestias quod architecto
          iste iure reprehenderit tempora, deserunt nam? Nam, ratione!
          Praesentium, maiores! Ipsa distinctio, obcaecati excepturi quisquam
          libero, eos, fugiat facere explicabo eveniet, sunt dolor.
        </dd>
      </dl>

      <blockquote>
        Ut venenatis, nisl scelerisque sollicitudin fermentum, quam libero
        hendrerit ipsum, ut blandit est tellus sit amet turpis.
        <cite>A N Other</cite>
      </blockquote>

      <pre>
        <code>
          {`<article>
  <p>This is some example HTML</p>
</article>`}
        </code>
      </pre>

      <p>
        Long string of text that needs breaking:<br></br>
        Lorem/ipsum/dolor/sit/amet/consectetur/adipisicing/elit/dolore/doloremque/obcaecati/eveniet/laboriosam/et/eos/deleniti
      </p>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Product Description</th>
            <th>Available</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>2</td>
            <td>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptas
              dolorum quasi illo.
            </td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>3</td>
            <td>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore
              doloremque obcaecati eveniet laboriosam et, eos deleniti.
            </td>
            <td>No</td>
          </tr>
          <tr>
            <td>3</td>
            <td>
              Lorem/ipsum/dolor/sit/amet/consectetur/adipisicing/elit/dolore/doloremque/obcaecati/eveniet/laboriosam/et/eos/deleniti
            </td>
            <td>No</td>
          </tr>
        </tbody>
      </table>

      <img src="https://picsum.photos/seed/picsum/500/500" alt="Alt text" />

      <hr />
    </React.Fragment>
  );
}
